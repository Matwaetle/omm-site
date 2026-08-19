# Verified product facts — the only allowed source of numbers/claims

Source of truth: `D:\Desktop\오픈소스 개발자 프로젝트\omm-hippo\README.md` (read it for anything not listed here) and real command captures below. DIRECTION.md §4.2's terminal sequence used INVENTED numbers — do NOT use those. Use the real capture + real output formats from omm source code instead.

## One-liner
apt/brew-style package manager for local LLMs (GGUF). Installs models into a central hub, links them into seven local AI runners automatically, recommends models that fit your hardware.

## The 7 runners + automation coverage (README verbatim)
| Runner | Automated on | Manual elsewhere |
|---|---|---|
| Ollama | macOS, Linux, Windows | — |
| LM Studio | macOS, Linux, Windows (headless `lms` CLI) | — |
| Jan | macOS (Homebrew), Windows (winget), Linux (Flatpak) | wherever that package manager isn't installed |
| AnythingLLM | macOS (Homebrew), Windows (winget) | Linux |
| Msty | macOS (Homebrew) | Windows, Linux |
| KoboldCpp | macOS (Apple Silicon), Linux (x86_64), Windows | Intel Mac, other architectures |
| text-generation-webui | macOS (any arch), Linux/Windows (x86_64) | ARM Linux/Windows |

## Real `omm scan --no-color` capture (2026-08-19, this dev machine)
```
                      omm hardware scan
┌───────────────────────┬───────────────────────────────────┐
│ Field                 │ Value                             │
├───────────────────────┼───────────────────────────────────┤
│ OS                    │ Windows 11                        │
│ CPU                   │ Intel(R) Core(TM) Ultra 7 155H    │
│ RAM (total)           │ 15.5 GB                           │
│ RAM (available)       │ 0.7 GB                            │
│ Safe model budget now │ 0.0 GB                            │
│ Reserved for apps/OS  │ 1.6 GB+                           │
│ GPU                   │ Intel(R) Arc(TM) Graphics         │
│ VRAM                  │ Shared or unavailable from the OS │
└───────────────────────┴───────────────────────────────────┘

  Local AI runners
 Program  Status
 Ollama   installed
+ 6 program(s) not installed — see the compatibility list:
https://github.com/omm-hippo/omm/wiki/Compatible-Programs
```
Note: "RAM available 0.7 GB" was captured under heavy load — if the demo needs a scan where a model fits, re-derive numbers from the real format above but keep CPU/GPU/OS/total-RAM identical, and available/budget plausible for this machine (e.g. available 9.8 GB, safe budget 8.2 GB). Format authenticity > this particular snapshot.

For `omm install` / `omm list` output formats: read the actual omm source (`omm-hippo/src/`) — grep for the progress/link/done strings and reproduce that real format. Do not invent a format.

## Verified claims (README line refs)
- Localfit safe budget: live scan subtracts memory used by other apps, keeps at least 2 GB (or 10% of RAM) for the OS, applies total-memory caps; rerunning adapts. (README ~145-149)
- Benchmark: versioned eight-item bilingual arithmetic smoke pack, Ollama only, stores no generated text, median of repeated samples, "intentionally small and is not a leaderboard". (README ~151-158)
- Signed catalogs: `omm setting catalog-trust` enables Ed25519 verification for recommendation downloads; artifacts snapshotted before replacement; `omm setting catalog-rollback` restores. (README ~238-239)
- Installers: versioned staging clone, verify signed commit against bootstrap trust anchor, then switch pipx. (README ~30)
- Install commands (verbatim from README):
  - macOS/Linux: `curl -fsSL https://raw.githubusercontent.com/omm-hippo/omm/main/install.sh | sh`
  - Windows: `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm https://raw.githubusercontent.com/omm-hippo/omm/main/install.ps1 | iex`
  - Windows caveat verbatim: "This must run before irm: script-internal TLS settings are too late for its first download."
  - Both: open a new shell afterward so PATH picks up `omm`. Requires Python 3.10+.
- License: MIT. Repo: github.com/omm-hippo/omm. CLI aliases: rm/ls/up. Exit codes 0/1/2. `--json` safe to pipe.
- Windows link strategy: hard link first, then symlink (Dev Mode/Admin), then owned copy with free-space check.
- Uninstall preserves models/settings; `--purge` removes hub too.

## Banned
Any number not traceable to the README, a real capture, or build-time API. Any claim about user counts, stars ("10,000+ developers"), speed multipliers, or rankings.
