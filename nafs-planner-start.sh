#!/usr/bin/env bash
# ==============================================================================
#  nafs-planner-start.sh
#
#  Pull the latest `main` from NAFS-Technologies/plane and redeploy the
#  /var/www/nafs-planner stack (docker compose project: deployments/cli/community).
#
#  The script inspects what actually changed in the incoming commits and only
#  rebuilds the images that need it, instead of always doing a full rebuild:
#
#    * config / branding / compose only  -> pull + recreate containers
#    * apps/web, apps/space, apps/admin, apps/live, packages/*, lockfiles
#                                        -> rebuild those frontend images
#    * apps/api                           -> rebuild backend image
#    * apps/api/plane/db/migrations/*     -> run the migrator service
#    * apps/proxy                         -> rebuild proxy image
#
#  Usage:
#    bash nafs-planner-start.sh                 smart update (default)
#    bash nafs-planner-start.sh --full          everything: rebuild all images +
#                                               migrate + refresh the web cache
#    bash nafs-planner-start.sh --build-all     rebuild every image, then recreate
#    bash nafs-planner-start.sh --migrate       force Django migrations
#    bash nafs-planner-start.sh --refresh-cache recreate web/proxy + check caching
#    bash nafs-planner-start.sh --no-pull       skip git, deploy current checkout
#    bash nafs-planner-start.sh --no-cache      rebuild images without layer cache
#    bash nafs-planner-start.sh --help
#
#  Environment overrides:
#    REPO_DIR, BRANCH, HEALTH_URL, HEALTH_RETRIES, HEALTH_INTERVAL, BACKUP_DIR,
#    DOCKERHUB_USER, APP_RELEASE, CDN_PURGE_URL, CDN_PURGE_TOKEN
# ==============================================================================

set -Eeuo pipefail

# ------------------------------------------------------------------ settings --
REPO_DIR="${REPO_DIR:-/var/www/nafs-planner}"
COMPOSE_DIR="$REPO_DIR/deployments/cli/community"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://163.53.183.219:10003/}"
HEALTH_RETRIES="${HEALTH_RETRIES:-40}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-5}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/nafs-planner-backups}"

SKIP_PULL=0
BUILD_ALL=0
NO_CACHE=0
FORCE_MIGRATE=0
REFRESH_CACHE=0
FULL=0

# -------------------------------------------------------------------- output --
if [[ -t 1 ]]; then
  C_RST=$'\033[0m'; C_INFO=$'\033[36m'; C_OK=$'\033[32m'
  C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_BOLD=$'\033[1m'
else
  C_RST=; C_INFO=; C_OK=; C_WARN=; C_ERR=; C_BOLD=
fi

log()  { printf '%s[%s]%s %s\n' "$C_INFO" "$(date '+%H:%M:%S')" "$C_RST" "$*"; }
ok()   { printf '%s  ✔%s %s\n' "$C_OK" "$C_RST" "$*"; }
warn() { printf '%s  !%s %s\n' "$C_WARN" "$C_RST" "$*" >&2; }
die()  { printf '%s  ✘ %s%s\n' "$C_ERR" "$*" "$C_RST" >&2; exit 1; }
step() { printf '\n%s== %s ==%s\n' "$C_BOLD" "$*" "$C_RST"; }

trap 'code=$?; printf "\n%s  ✘ aborted at line %s (exit %s)%s\n" "$C_ERR" "${BASH_LINENO[0]}" "$code" "$C_RST" >&2; exit $code' ERR

usage() {
  awk 'NR > 1 { if ($0 !~ /^#/) exit; sub(/^# ?/, ""); print }' "$0"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-pull)   SKIP_PULL=1 ;;
    --build-all) BUILD_ALL=1 ;;
    --no-cache)  NO_CACHE=1 ;;
    --migrate)   FORCE_MIGRATE=1 ;;
    --refresh-cache) REFRESH_CACHE=1 ;;
    --full)      FULL=1 ;;
    -h|--help)   usage ;;
    *)           die "unknown option: $1 (try --help)" ;;
  esac
  shift
done

if [[ $FULL -eq 1 ]]; then
  BUILD_ALL=1
  FORCE_MIGRATE=1
  REFRESH_CACHE=1
fi

# ------------------------------------------------------------------ preflight --
step "Preflight"

[[ -d "$REPO_DIR/.git" ]]          || die "not a git repo: $REPO_DIR"
[[ -f "$COMPOSE_DIR/docker-compose.yml" ]] || die "missing $COMPOSE_DIR/docker-compose.yml"
[[ -f "$COMPOSE_DIR/build.yml" ]]  || die "missing $COMPOSE_DIR/build.yml"
[[ -f "$COMPOSE_DIR/variables.env" ]] || die "missing $COMPOSE_DIR/variables.env"

if docker info >/dev/null 2>&1; then
  DOCKER_BIN=docker
elif sudo -n docker info >/dev/null 2>&1; then
  DOCKER_BIN="sudo docker"
else
  die "cannot talk to the Docker daemon (add this user to the 'docker' group)"
fi
log "docker: $DOCKER_BIN"

mkdir -p "$BACKUP_DIR"
LOG_FILE="$BACKUP_DIR/deploy-$(date '+%Y%m%d-%H%M%S').log"
exec > >(tee -a "$LOG_FILE") 2>&1
log "log file: $LOG_FILE"

env_value() { awk -F= -v k="$1" '$1 == k { sub(/^[^=]*=/, ""); print; exit }' "$COMPOSE_DIR/variables.env"; }

APP_RELEASE="${APP_RELEASE:-$(env_value APP_RELEASE)}"
APP_RELEASE="${APP_RELEASE:-preview}"
DOCKERHUB_USER="${DOCKERHUB_USER:-$(env_value DOCKERHUB_USER)}"
DOCKERHUB_USER="${DOCKERHUB_USER:-makeplane}"
export APP_RELEASE DOCKERHUB_USER
log "image namespace: $DOCKERHUB_USER/plane-*:$APP_RELEASE"

# compose helpers (variables.env is referenced relative to the compose dir)
dc()     { ( cd "$COMPOSE_DIR" && $DOCKER_BIN compose --env-file variables.env "$@" ); }
buildc() { ( cd "$COMPOSE_DIR" && $DOCKER_BIN compose -f build.yml --env-file variables.env "$@" ); }

image_of() {
  case "$1" in
    web)                    echo "$DOCKERHUB_USER/plane-frontend:$APP_RELEASE" ;;
    space)                  echo "$DOCKERHUB_USER/plane-space:$APP_RELEASE" ;;
    admin)                  echo "$DOCKERHUB_USER/plane-admin:$APP_RELEASE" ;;
    live)                   echo "$DOCKERHUB_USER/plane-live:$APP_RELEASE" ;;
    api)                    echo "$DOCKERHUB_USER/plane-backend:$APP_RELEASE" ;;
    proxy)                  echo "$DOCKERHUB_USER/plane-proxy:$APP_RELEASE" ;;
    *)                      die "unknown build service: $1" ;;
  esac
}
image_exists() { $DOCKER_BIN image inspect "$1" >/dev/null 2>&1; }

# -------------------------------------------------------------------- 1. pull --
PREV_HEAD="$(git -C "$REPO_DIR" rev-parse HEAD)"
NEW_HEAD="$PREV_HEAD"
declare -a CHANGED=()
CONFIG_CHANGED=0
BRANDING_ONLY=0

if [[ $SKIP_PULL -eq 1 ]]; then
  step "1/7  Pull  (skipped: --no-pull)"
else
  step "1/7  Pull  origin/$BRANCH"
  log "current commit: ${PREV_HEAD:0:9}"

  # variables.env and docker-compose.yml are tracked but also carry live
  # production settings, so keep a copy before the working tree moves.
  SNAP="$BACKUP_DIR/snapshot-$(date '+%Y%m%d-%H%M%S')"
  mkdir -p "$SNAP"
  cp -a "$COMPOSE_DIR/variables.env" "$SNAP/" 2>/dev/null || true
  cp -a "$COMPOSE_DIR/docker-compose.yml" "$SNAP/" 2>/dev/null || true
  log "config snapshot: $SNAP"

  if [[ -n "$(git -C "$REPO_DIR" status --porcelain --untracked-files=no)" ]]; then
    warn "working tree has local modifications:"
    git -C "$REPO_DIR" status --short --untracked-files=no | sed 's/^/      /' >&2
    warn "a conflicting pull will abort and leave the tree untouched"
  fi

  git -C "$REPO_DIR" fetch --prune origin "$BRANCH"
  git -C "$REPO_DIR" merge --ff-only FETCH_HEAD \
    || die "fast-forward pull failed - resolve the local changes above, then re-run"

  NEW_HEAD="$(git -C "$REPO_DIR" rev-parse HEAD)"
  log "new commit:     ${NEW_HEAD:0:9}"

  if [[ "$PREV_HEAD" == "$NEW_HEAD" ]]; then
    ok "already up to date with origin/$BRANCH"
  else
    ok "updated ${PREV_HEAD:0:9} -> ${NEW_HEAD:0:9}"
    mapfile -t CHANGED < <(git -C "$REPO_DIR" diff --name-only "$PREV_HEAD" "$NEW_HEAD")
    log "$(git -C "$REPO_DIR" log --oneline "$PREV_HEAD..$NEW_HEAD" | wc -l) new commit(s), ${#CHANGED[@]} changed file(s)"
  fi

  # A pull may have rewritten prod config; that always warrants a recreate.
  if git -C "$REPO_DIR" diff --quiet "$PREV_HEAD" "$NEW_HEAD" -- \
       deployments/cli/community/ docker-compose.yml; then
    CONFIG_CHANGED=0
  else
    CONFIG_CHANGED=1
  fi

  # custom_branding/ is bind-mounted into the `web` service only, so a
  # branding-only commit needs just that one container recreated.
  if [[ $CONFIG_CHANGED -eq 1 ]] && git -C "$REPO_DIR" diff --quiet \
       "$PREV_HEAD" "$NEW_HEAD" -- . \
       ':(exclude)deployments/cli/community/custom_branding/**'; then
    BRANDING_ONLY=1
  fi
fi

# ---------------------------------------------------------------- 2. inspect --
step "2/7  Decide what to rebuild"

changed_any() {
  local pattern file
  for pattern in "$@"; do
    for file in "${CHANGED[@]:-}"; do
      [[ "$file" == $pattern ]] && return 0
    done
  done
  return 1
}

need_web=0; need_space=0; need_admin=0; need_live=0; need_api=0; need_proxy=0
need_migrate=0

if [[ $BUILD_ALL -eq 1 ]]; then
  need_web=1; need_space=1; need_admin=1; need_live=1; need_api=1; need_proxy=1
  need_migrate=1; CONFIG_CHANGED=1
  log "forced full rebuild (--build-all)"
else
  changed_any 'apps/web/*'   && need_web=1
  changed_any 'apps/space/*' && need_space=1
  changed_any 'apps/admin/*' && need_admin=1
  changed_any 'apps/live/*'  && need_live=1
  changed_any 'apps/api/*'   && need_api=1
  changed_any 'apps/proxy/*' && need_proxy=1

  # shared workspace inputs are baked into every pnpm-built frontend image
  if changed_any 'packages/*' 'pnpm-lock.yaml' 'pnpm-workspace.yaml' \
                 'package.json' 'turbo.json' '.npmrc' 'patches/*'; then
    need_web=1; need_space=1; need_admin=1; need_live=1
    log "shared workspace changed -> rebuilding all frontend images"
  fi

  changed_any 'apps/api/plane/db/migrations/*' && need_migrate=1
fi

if [[ $FORCE_MIGRATE -eq 1 ]]; then
  need_migrate=1
  log "migrations forced (--migrate)"
fi

# First run / pruned images: build anything whose image is missing locally.
for svc in web space admin live api proxy; do
  if [[ $(eval "echo \$need_$svc") -eq 0 ]] && ! image_exists "$(image_of "$svc")"; then
    eval "need_$svc=1"
    log "image $(image_of "$svc") missing locally -> will build"
  fi
done

BUILD_SERVICES=()
[[ $need_web   -eq 1 ]] && BUILD_SERVICES+=(web)
[[ $need_space -eq 1 ]] && BUILD_SERVICES+=(space)
[[ $need_admin -eq 1 ]] && BUILD_SERVICES+=(admin)
[[ $need_live  -eq 1 ]] && BUILD_SERVICES+=(live)
[[ $need_api   -eq 1 ]] && BUILD_SERVICES+=(api)
[[ $need_proxy -eq 1 ]] && BUILD_SERVICES+=(proxy)

if [[ ${#BUILD_SERVICES[@]} -eq 0 ]]; then
  log "no source changes -> configuration only (recreate, no build)"
else
  log "images to build: ${BUILD_SERVICES[*]}"
fi
if [[ $CONFIG_CHANGED -eq 1 ]]; then
  if [[ $BRANDING_ONLY -eq 1 && ${#BUILD_SERVICES[@]} -eq 0 ]]; then
    log "branding-only change -> web container recreate"
  else
    log "compose/config change detected -> full stack recreate"
  fi
fi
[[ $need_migrate   -eq 1 ]] && log "database migrations will run"

# -------------------------------------------------------------------- 3. build --
step "3/7  Build images"
if [[ ${#BUILD_SERVICES[@]} -eq 0 ]]; then
  ok "nothing to build"
else
  for svc in "${BUILD_SERVICES[@]}"; do
    log "building $svc -> $(image_of "$svc")"
  done
  if [[ $NO_CACHE -eq 1 ]]; then
    buildc build --no-cache "${BUILD_SERVICES[@]}"
  else
    buildc build "${BUILD_SERVICES[@]}"
  fi
  ok "build finished"
fi

# ------------------------------------------------------------------ 4. migrate --
step "4/7  Database migrations"
if [[ $need_migrate -eq 1 ]]; then
  log "running migrator service (docker compose run --rm migrator)"
  dc run --rm migrator
  ok "migrations applied"
else
  ok "skipped (no apps/api/plane/db/migrations change)"
fi

# ----------------------------------------------------------------- 5. recreate --
step "5/7  Recreate containers"

declare -a RECREATE=()
if [[ ${#BUILD_SERVICES[@]} -eq 0 && $BRANDING_ONLY -eq 1 ]]; then
  RECREATE=(web)                 # only web bind-mounts custom_branding/
elif [[ $CONFIG_CHANGED -eq 1 || $BUILD_ALL -eq 1 ]]; then
  RECREATE=()                    # empty == whole stack
else
  [[ $need_web   -eq 1 ]] && RECREATE+=(web)
  [[ $need_space -eq 1 ]] && RECREATE+=(space)
  [[ $need_admin -eq 1 ]] && RECREATE+=(admin)
  [[ $need_live  -eq 1 ]] && RECREATE+=(live)
  [[ $need_api   -eq 1 ]] && RECREATE+=(api worker beat-worker)
  [[ $need_proxy -eq 1 ]] && RECREATE+=(proxy)
fi

if [[ ${#RECREATE[@]} -eq 0 ]]; then
  log "ensure stack is up (up -d)"
  dc up -d
  ok "stack is up"
else
  log "force-recreate: ${RECREATE[*]}"
  dc up -d --force-recreate "${RECREATE[@]}"
  ok "recreated: ${RECREATE[*]}"
fi

# ----------------------------------------------------------- 6. cache refresh --
step "6/7  Refresh web cache"

if [[ $REFRESH_CACHE -eq 1 ]]; then
  # Nothing in front of this stack caches assets: there is no CDN, and the web
  # container is plain Caddy file_server. index.html is already served
  # no-store and the JS/CSS filenames are content-hashed, so a fresh container
  # with fresh bind mounts is what actually makes a new build visible.
  log "recreating web + proxy so new assets and branding mounts are live"
  dc up -d --force-recreate web proxy
  ok "web + proxy recreated"

  log "cache headers now served:"
  for probe in / /sw.js /manifest.json /site.webmanifest.json; do
    HDRS="$(curl -sS -D - -o /dev/null --max-time 10 "${HEALTH_URL%/}${probe}" 2>/dev/null || true)"
    CC="$(printf '%s' "$HDRS" | tr -d '\r' \
          | awk '/^[Cc]ache-[Cc]ontrol:/ { sub(/^[^:]*:[[:space:]]*/, ""); print; exit }')"
    if [[ -n "$CC" ]]; then
      ok "$probe -> Cache-Control: $CC"
    else
      warn "$probe -> no Cache-Control (browsers may reuse a stale copy)"
    fi
  done

  if [[ -n "${CDN_PURGE_URL:-}" ]]; then
    log "purging CDN cache: $CDN_PURGE_URL"
    PURGE=(-sS -X POST "$CDN_PURGE_URL" -H 'Content-Type: application/json'
           -d '{"purge_everything":true}')
    [[ -n "${CDN_PURGE_TOKEN:-}" ]] && PURGE+=(-H "Authorization: Bearer $CDN_PURGE_TOKEN")
    if curl "${PURGE[@]}" >/dev/null; then ok "CDN cache purged"; else warn "CDN purge failed"; fi
  fi
else
  ok "skipped (use --refresh-cache or --full)"
fi

# ------------------------------------------------------------- 7. healthcheck --
step "7/7  Health check"

$DOCKER_BIN compose -f "$COMPOSE_DIR/docker-compose.yml" \
  --project-directory "$COMPOSE_DIR" ps 2>/dev/null || dc ps

if [[ $need_web -eq 1 ]]; then
  log "checking branding overlay against the freshly built web image"
  if IMAGE_ASSETS="$($DOCKER_BIN run --rm --entrypoint sh "$(image_of web)" \
        -c 'ls -1 /usr/share/caddy/html/assets' 2>/dev/null)"; then
    MISSING=()
    while IFS= read -r mount; do
      name="$(basename "${mount##*:}")"
      # Only hashed build artefacts can drift when apps/web is rebuilt; plainly
      # named files (taskflow.png, ...) are hand-added assets, not replacements.
      [[ "$name" =~ -[A-Za-z0-9_]{5,}\. ]] || continue
      grep -qxF -- "$name" <<<"$IMAGE_ASSETS" || MISSING+=("$name")
    done < <(grep -oE '\./custom_branding/[^:[:space:]]+:/usr/share/caddy/html/assets/[^:[:space:]]+' \
               "$COMPOSE_DIR/docker-compose.yml" | sort -u 2>/dev/null || true)
    if [[ ${#MISSING[@]} -gt 0 ]]; then
      warn "the new web build no longer ships ${#MISSING[@]} asset(s) that custom_branding/ overrides:"
      printf '      %s\n' "${MISSING[@]}" >&2
      warn "those files will silently fall back to the upstream versions -"
      warn "re-sync custom_branding/assets with the new build if that matters"
    else
      ok "branding overlay is in sync with the new web build"
    fi
  else
    warn "could not inspect the web image for the branding overlay check"
  fi
fi

log "waiting for $HEALTH_URL (up to $((HEALTH_RETRIES * HEALTH_INTERVAL))s)"
HEALTH_OK=0
for ((i = 1; i <= HEALTH_RETRIES; i++)); do
  CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$HEALTH_URL" 2>/dev/null || echo 000)"
  if [[ "$CODE" == "200" ]]; then
    HEALTH_OK=1
    break
  fi
  printf '      attempt %s/%s -> HTTP %s\n' "$i" "$HEALTH_RETRIES" "$CODE"
  sleep "$HEALTH_INTERVAL"
done

printf '\n'
if [[ $HEALTH_OK -eq 1 ]]; then
  ok "deployment healthy - $HEALTH_URL returned 200"
  ok "commit ${NEW_HEAD:0:9} is live"
else
  warn "health check did not pass for $HEALTH_URL"
  warn "inspect logs:  cd $COMPOSE_DIR && docker compose --env-file variables.env logs --tail=100"
  warn "roll back with: git -C $REPO_DIR reset --hard ${PREV_HEAD:0:9} && bash $0 --no-pull --build-all"
  warn "log file: $LOG_FILE"
  exit 1
fi
