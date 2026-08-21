/**
 * Content for the three per-OS install guides.
 *
 * Every command, error string and coverage claim below traces to the omm
 * product repo — see design/FACTS.md, section "Install guide pages", for the
 * file and line behind each one. Nothing here is paraphrased from memory: the
 * `see` field of a troubleshooting entry is the message the script (or the
 * shell) actually prints.
 */

export type Slug = "windows" | "macos" | "linux";

export type Command = {
  /** Shell prompt glyph rendered before the command; not part of the copy. */
  readonly prompt: string;
  readonly command: string;
  /** Optional line above the block, e.g. what the command is for. */
  readonly caption?: string;
};

/** One row of the "am I in the right program?" table. */
export type PromptSample = {
  readonly sample: string;
  readonly program: string;
  readonly ok: boolean;
};

export type Requirement = {
  readonly label: string;
  readonly body: string;
  /** Where to get the thing, when it is something the reader has to install. */
  readonly links?: readonly { readonly label: string; readonly href: string }[];
};

/** An install route other than the one the page leads with. */
export type AltInstall = {
  readonly heading: string;
  readonly body: string;
  readonly commands: readonly Command[];
  readonly notes: readonly string[];
};

export type AfterStep = {
  readonly step: string;
  readonly title: string;
  readonly body: string;
  readonly command?: Command;
};

export type RunnerRow = {
  readonly runner: string;
  readonly how: string;
  readonly automated: boolean;
};

export type Trouble = {
  /** Verbatim message. Rendered in mono. */
  readonly see: string;
  readonly why: string;
  readonly fix: string;
  /** Where the string comes from, shown to the reader. */
  readonly source: string;
};

export type Guide = {
  readonly slug: Slug;
  readonly os: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly heading: string;
  readonly lede: string;

  readonly app: {
    readonly heading: string;
    readonly body: string;
    readonly open: readonly string[];
    readonly samplesIntro: string;
    readonly samples: readonly PromptSample[];
    readonly notes: readonly string[];
  };

  readonly before: {
    readonly body: string;
    readonly requirements: readonly Requirement[];
  };

  readonly install: {
    readonly body: string;
    readonly command: Command;
    readonly notes: readonly string[];
    readonly alts: readonly AltInstall[];
  };

  readonly after: {
    readonly body: string;
    readonly steps: readonly AfterStep[];
    /** Real captured output, or null when no capture exists for this OS. */
    readonly capture: {
      readonly title: string;
      readonly text: string;
      readonly footnote: string;
    } | null;
    readonly scanFields: readonly string[] | null;
  };

  readonly runners: {
    readonly body: string;
    readonly rows: readonly RunnerRow[];
    readonly notes: readonly string[];
    readonly linking: readonly string[] | null;
  };

  readonly keeping: {
    readonly storageBody: string;
    readonly storageCommands: readonly Command[];
    readonly storageNotes: readonly string[];
    readonly completionBody: string;
    readonly completionCommand: Command;
    readonly uninstallBody: string;
    readonly uninstallCommand: Command;
    readonly uninstallNotes: readonly string[];
  };

  readonly trouble: readonly Trouble[];
};

const RAW = "https://raw.githubusercontent.com/omm-hippo/omm/main";

/* ========================================================================== */
/* Windows                                                                    */
/* ========================================================================== */

const WINDOWS: Guide = {
  slug: "windows",
  os: "Windows",
  metaTitle: "Install omm on Windows",
  metaDescription:
    "Step-by-step omm install for Windows: which PowerShell window to open, the exact command with its TLS pre-line, what the installer verifies, and what to do about every error the installer can print.",
  heading: "Install omm on Windows",
  lede: "The whole install is one line, but it has to run in the right program. This page names that program, gives you the command, and lists the messages the installer can print with what each one means.",

  app: {
    heading: "Open PowerShell",
    body: "omm's Windows installer is a PowerShell script. It cannot run in Command Prompt, and it cannot run in Git Bash or a WSL shell — those are Unix shells and do not understand PowerShell commands.",
    open: [
      "Press the Windows key, type PowerShell, and open Windows PowerShell. Either Windows PowerShell 5.1 (built into Windows) or PowerShell 7 works.",
      "Windows Terminal is fine as a window, but check the tab: open the arrow next to the plus sign and pick Windows PowerShell or PowerShell, not Command Prompt.",
      "You do not need to run as Administrator to install omm.",
    ],
    samplesIntro:
      "If you are not sure what you have open, look at the prompt at the start of the line.",
    samples: [
      {
        sample: "PS C:\\Users\\you>",
        program: "PowerShell — this is the one you want",
        ok: true,
      },
      {
        sample: "C:\\Users\\you>",
        program: "Command Prompt — the install command will not work here",
        ok: false,
      },
      {
        sample: "you@PC MINGW64 ~$",
        program: "Git Bash — the install command will not work here",
        ok: false,
      },
    ],
    notes: [
      "Windows 10 22H2 or Windows 11 is the supported baseline, because that is what Ollama requires on Windows.",
    ],
  },

  before: {
    body: "The installer fetches what it needs, but two of those bootstraps depend on winget being present.",
    requirements: [
      {
        label: "Python 3.10+",
        body: "Required. If no suitable Python is on PATH, the installer asks winget to install Python 3.12 and then looks again.",
        links: [
          { label: "python.org/downloads", href: "https://www.python.org/downloads/" },
        ],
      },
      {
        label: "git",
        body: "Required, because omm is installed from a verified Git checkout. If it is missing, the installer asks winget for MinGit.",
        links: [
          { label: "git-scm.com/downloads", href: "https://git-scm.com/downloads" },
        ],
      },
      {
        label: "winget",
        body: "Built into Windows 10 2004 and later and into Windows 11. On anything older it is absent, so install Python 3.10+ and git yourself first — the installer will not be able to.",
        links: [
          { label: "winget documentation", href: "https://learn.microsoft.com/en-us/windows/package-manager/winget/" },
          { label: "python.org/downloads", href: "https://www.python.org/downloads/" },
          { label: "git-scm.com/downloads", href: "https://git-scm.com/downloads" },
        ],
      },
      {
        label: "Windows baseline",
        body: "omm is tested on Windows, macOS and Linux with Python 3.10+. Windows 10 22H2 / 11 is the supported Windows baseline.",
      },
      {
        label: "NVIDIA extra",
        body: "The optional NVIDIA detector is installed only when nvidia-smi shows an NVIDIA driver is present. Nothing to do either way.",
      },
    ],
  },

  install: {
    body: "Paste the whole line, including the part before the semicolon, into PowerShell and press Enter.",
    command: {
      prompt: "PS >",
      command: `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm ${RAW}/install.ps1 | iex`,
    },
    notes: [
      "The first half is not optional. It must run before irm: script-internal TLS settings are too late for its first download — by the time PowerShell reads a line of the script, the script has already been downloaded.",
      "irm downloads the script and iex runs it. Both are PowerShell commands, which is why the tab has to be PowerShell.",
      "Open a new PowerShell window afterward so your PATH picks up omm.",
    ],
    alts: [
      {
        heading: "Or install the package",
        body: "There is also a plain package install from PyPI. It skips the signed-commit check that the script above performs, and it is the right choice if you already manage your Python tooling.",
        commands: [
          { prompt: "PS >", command: "python -m pip install omm-model" },
          {
            prompt: "PS >",
            command: "pipx install omm-model",
            caption: "For an isolated command-line installation, pipx is recommended",
          },
        ],
        notes: [
          "The distribution name is omm-model; the installed command and Python import remain omm.",
          "Upgrade and remove it with the same tool that installed it: python -m pip install --upgrade omm-model, or pipx upgrade omm-model. Both preserve downloaded models and settings under OMM_HOME.",
          "This does not go through the signed-commit verification described above; it relies on PyPI's own account security and TLS, the same trust model as installing any other PyPI package.",
          "omm update only updates a canonical omm Git-source installation. On a pip or pipx install it changes nothing and prints the matching package manager command instead. The Git-only beta channel is likewise unavailable to package-managed installations.",
        ],
      },
    ],
  },

  after: {
    body: "The installer's last line is Done. If 'omm' isn't found, open a new PowerShell window (pipx just updated your PATH). Take that literally.",
    steps: [
      {
        step: "01",
        title: "open a new PowerShell window",
        body: "pipx added its bin directory to your PATH, but a window that was already open keeps the PATH it started with. Close it and open a fresh one.",
      },
      {
        step: "02",
        title: "run omm once",
        body: "A bare omm on a fresh install starts the setup wizard: a hardware summary, then a checklist of local AI runners. Checking one that omm can install on Windows runs its official installer with live progress; checking one it cannot automate here prints a link instead. You can re-run it any time with omm setup.",
        command: { prompt: "PS >", command: "omm" },
      },
      {
        step: "03",
        title: "check what omm sees",
        body: "omm scan prints the hardware, runner and model summary it will base every fit decision on.",
        command: { prompt: "PS >", command: "omm scan" },
      },
    ],
    capture: {
      title: "omm scan --no-color, Windows 11",
      text: `                      omm hardware scan
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
+ 6 program(s) not installed`,
      footnote:
        "A real capture from one Windows 11 machine under heavy load, which is why the safe budget reads 0.0 GB. Your own numbers will differ; the shape of the output will not.",
    },
    scanFields: null,
  },

  runners: {
    body: "omm links one central copy of each model into every runner it finds. The setup wizard can install some of those runners for you — which ones depends on the operating system, because it only uses each vendor's own supported package.",
    rows: [
      { runner: "Ollama", how: "Automated", automated: true },
      {
        runner: "LM Studio",
        how: "Automated — headless lms CLI",
        automated: true,
      },
      { runner: "Jan", how: "Automated — winget", automated: true },
      {
        runner: "KoboldCpp",
        how: "Automated on 64-bit x86 (AMD64)",
        automated: true,
      },
      {
        runner: "text-generation-webui",
        how: "Automated on 64-bit x86",
        automated: true,
      },
      {
        runner: "AnythingLLM",
        how: "Manual — install it yourself, omm still links to it",
        automated: false,
      },
      {
        runner: "Msty",
        how: "Manual — install it yourself, omm still links to it",
        automated: false,
      },
    ],
    notes: [
      "Manual here means only that the wizard will not run the vendor's installer for you; it prints the download link, and once the app exists omm detects and links it like any other runner.",
      "AnythingLLM has no winget package any more — the community manifest was withdrawn in 2025 — and no winget package targets the current Msty Studio app rather than its retired predecessor. That is why neither is automated on Windows.",
      "Every runner already installed is listed in the wizard too, marked as installed rather than hidden, so the checklist always reflects what omm actually detects.",
      "On Windows, Ollama is detected through its HTTP API first, so a freshly installed tray app is found even before this terminal receives the new PATH.",
    ],
    linking: [
      "omm keeps one file in the hub and exposes it to each runner. On Windows it tries an unprivileged same-volume hard link first.",
      "If that is not possible it tries a symbolic link, which needs Developer Mode turned on or an Administrator shell.",
      "If neither works it falls back to an owned copy. Before copying, omm checks the destination's free space and reports that the model now consumes additional bytes.",
      "File junctions never apply here, because the link targets are files, not directories.",
    ],
  },

  keeping: {
    storageBody:
      "The model hub and omm's own state default to a .omm folder in your user profile. Set OMM_HOME before installing, and on later runs, to put them on another drive.",
    storageCommands: [
      {
        prompt: "PS >",
        command:
          '[Environment]::SetEnvironmentVariable("OMM_HOME", "D:\\omm", "User")',
        caption: "Persist it for future windows",
      },
      {
        prompt: "PS >",
        command: '$env:OMM_HOME = "D:\\omm"',
        caption: "And set it in the window you have open now",
      },
    ],
    storageNotes: [
      "Ollama's own model location follows OLLAMA_MODELS. LM Studio follows its home pointer; set OMM_LMSTUDIO_MODELS_DIR when LM Studio uses a custom directory omm cannot discover.",
    ],
    completionBody:
      "Install tab-completion once, then restart the shell.",
    completionCommand: {
      prompt: "PS >",
      command: "omm --install-completion powershell",
    },
    uninstallBody:
      "This removes the omm command and the installer-managed source checkouts. Downloaded models and settings under OMM_HOME are preserved.",
    uninstallCommand: {
      prompt: "PS >",
      command: `irm ${RAW}/uninstall.ps1 | iex`,
    },
    uninstallNotes: [
      "To remove the model hub and settings as well, download the script and run it with -Purge. Purge removes only known omm-owned paths and leaves unrelated files in a custom OMM_HOME untouched.",
      "Installers mark custom homes so uninstallers can refuse ambiguous or unsafe locations, and shell profiles are never rewritten during uninstall.",
      "If you installed from PyPI instead, use python -m pip uninstall omm-model or pipx uninstall omm-model. Both preserve models and settings.",
    ],
  },

  trouble: [
    {
      see: "sh : The term 'sh' is not recognized as the name of a cmdlet, function, script file, or operable program.",
      why: "You pasted the macOS and Linux command (the one with curl … | sh) into PowerShell. PowerShell has no sh.",
      fix: "Use the Windows command in step 3 of this page instead. The two operating systems get genuinely different commands, not two spellings of the same one.",
      source: "README, Install section — two separate installer commands",
    },
    {
      see: "Windows detected. Run the native PowerShell installer instead:",
      why: "The Unix installer ran under Git Bash, MSYS or Cygwin. It detects that it is on Windows and refuses rather than installing something broken.",
      fix: "Open PowerShell as described in step 1 and run the Windows command. The message prints the right command too.",
      source: "install.sh:27-32",
    },
    {
      see: "'irm' is not recognized as an internal or external command, operable program or batch file.",
      why: "You are in Command Prompt. irm and iex are PowerShell commands.",
      fix: "Open PowerShell. In Windows Terminal, use the arrow next to the plus sign and start a PowerShell tab.",
      source: "README, Install section — the command is PowerShell-only",
    },
    {
      see: "Invoke-RestMethod : The request was aborted: Could not create SSL/TLS secure channel.",
      why: "Windows PowerShell 5.1 defaulted to a TLS version GitHub no longer accepts. The script cannot fix this from inside itself, because irm has to download it first.",
      fix: "Run the full line including the [Net.ServicePointManager] part before irm. If it still fails, a corporate proxy or an antivirus inspecting HTTPS is intercepting the connection — try another network.",
      source: "install.ps1:1-5 (header comment); README Windows caveat",
    },
    {
      see: "Python not found. Install Python 3.10+ first: https://www.python.org/downloads/",
      why: "No Python 3.10 or newer was found, and winget either is not installed or its install attempt failed.",
      fix: "Install Python from python.org, tick Add python.exe to PATH during setup, open a new PowerShell window, and run the install command again.",
      source: "install.ps1:217",
    },
    {
      see: "git not found. Install git first (needed to fetch omm from GitHub): https://git-scm.com/downloads",
      why: "Same situation for git: omm is installed from a verified Git checkout, so git has to exist.",
      fix: "Install git from the linked page, open a new PowerShell window, and run the install command again.",
      source: "install.ps1:229 and install.ps1:234",
    },
    {
      see: "git 2.34+ is required to verify SSH commit signatures (found git version 2.30.0).",
      why: "Your git is too old to check SSH commit signatures. The installer treats cannot verify exactly like a bad signature.",
      fix: "Update git, then run the install command again.",
      source: "install.ps1:105",
    },
    {
      see: "Signature verification failed - refusing to install untrusted code.",
      why: "The staged commit was not signed by a key in the installer's trust anchor — or git could not check the signature at all, as in the previous entry.",
      fix: "Update git and retry. If it still fails, do not work around it with a plain git clone: open an issue on the repository instead.",
      source: "install.ps1:553",
    },
    {
      see: "git clone failed.",
      why: "The staging clone could not reach github.com. Usually a proxy, a firewall, or no network.",
      fix: "Confirm you can open github.com in a browser from this machine, then run the install command again.",
      source: "install.ps1:529",
    },
    {
      see: "Refusing to replace unrelated pipx environment 'omm'. Remove or rename that environment manually first.",
      why: "An unrelated PyPI project also called omm already owns that pipx environment. The installer will not overwrite someone else's tool.",
      fix: "Run pipx uninstall omm if you do not need that other tool, or rename its environment, then run the install command again.",
      source: "install.ps1:506",
    },
    {
      see: "Refusing to replace an unverified omm-model pipx environment.",
      why: "An omm-model pipx environment exists but does not look like one omm created.",
      fix: "Run pipx uninstall omm-model, then run the install command again.",
      source: "install.ps1:514",
    },
    {
      see: "Refusing unsafe OMM_HOME: C:\\Users\\you",
      why: "OMM_HOME points at a drive root or at your user profile itself. Uninstalling from there could not be made safe.",
      fix: "Point OMM_HOME at a subdirectory, such as D:\\omm. A related message, Refusing OMM_HOME that contains the current directory, means you are standing inside that folder — cd somewhere else first.",
      source: "install.ps1:13 and install.ps1:18",
    },
    {
      see: "omm : The term 'omm' is not recognized as the name of a cmdlet …",
      why: "The install finished, but this window still has the PATH it started with.",
      fix: "Open a new PowerShell window. The installer prints the same advice on its last line.",
      source: "install.ps1:671",
    },
    {
      see: "Refusing unrecognized custom OMM_HOME (missing .omm-managed): D:\\omm",
      why: "You are uninstalling with a custom OMM_HOME that the installer never marked as its own, so the uninstaller cannot prove the folder is safe to touch.",
      fix: "Check that OMM_HOME points at the folder omm actually installed into, then run the uninstaller again.",
      source: "uninstall.ps1:21",
    },
  ],
};

/* ========================================================================== */
/* macOS                                                                      */
/* ========================================================================== */

const MACOS: Guide = {
  slug: "macos",
  os: "macOS",
  metaTitle: "Install omm on macOS",
  metaDescription:
    "Step-by-step omm install for macOS: opening Terminal, the Python 3.10+ requirement macOS does not satisfy on its own, the exact command, what the installer verifies, and what each error message means.",
  heading: "Install omm on macOS",
  lede: "One command in Terminal. The part worth reading first is the Python requirement: the version of Python that ships with macOS is usually too old, and the installer will not replace it for you.",

  app: {
    heading: "Open Terminal",
    body: "Any terminal application works. The command runs under sh, so your login shell being zsh, bash or fish makes no difference.",
    open: [
      "Press Command and Space, type Terminal, and press Enter. Terminal is also in Applications › Utilities.",
      "iTerm2, Warp, Ghostty, or the terminal built into your editor are all fine.",
      "You do not need sudo to install omm.",
    ],
    samplesIntro: "The prompt tells you which shell you are in. All of these are fine.",
    samples: [
      { sample: "you@Mac ~ %", program: "zsh — the macOS default", ok: true },
      { sample: "you@Mac:~$", program: "bash", ok: true },
      { sample: "$", program: "sh, or a bare prompt", ok: true },
    ],
    notes: [
      "omm is tested in CI on macOS with Python 3.10+, on both Apple Silicon and Intel.",
    ],
  },

  before: {
    body: "The installer's automatic dependency bootstrap uses apt, which does not exist on macOS. On a Mac it therefore expects Python and git to already be there.",
    requirements: [
      {
        label: "Python 3.10+",
        body: "Required, and this is the one that usually bites. The python3 that comes with macOS is older than 3.10 on most systems. Install a current Python from python.org, or with Homebrew, before running the installer.",
        links: [
          { label: "python.org/downloads", href: "https://www.python.org/downloads/" },
          { label: "brew.sh", href: "https://brew.sh" },
        ],
      },
      {
        label: "git",
        body: "Required. macOS ships a git stub that opens Apple's Command Line Tools installer the first time you run it; accept that dialog, or run xcode-select --install yourself.",
        links: [
          { label: "git-scm.com/downloads", href: "https://git-scm.com/downloads" },
        ],
      },
      {
        label: "pipx",
        body: "The installer installs pipx for you through the exact Python it validated, retrying with --break-system-packages when a Homebrew or PEP 668 Python refuses a plain --user install.",
      },
    ],
  },

  install: {
    body: "Paste this into Terminal and press Enter.",
    command: {
      prompt: "$",
      command: `curl -fsSL ${RAW}/install.sh | sh`,
    },
    notes: [
      "curl downloads the script and sh runs it. It installs omm as an isolated CLI through pipx.",
      "Open a new shell afterward so your PATH picks up omm.",
      "The -f and -s flags make curl silent on failure. If nothing at all happens, see the troubleshooting section below.",
    ],
    alts: [
      {
        heading: "Or install from the Homebrew Tap",
        body: "omm publishes a Homebrew Tap. Use it if Homebrew is already how you manage command-line tools on this Mac.",
        commands: [
          {
            prompt: "$",
            command: "brew install omm-hippo/omm/omm",
            caption: "macOS · Homebrew Tap",
          },
          {
            prompt: "$",
            command: "brew upgrade omm-hippo/omm/omm",
            caption: "Upgrade or remove the formula with Homebrew",
          },
          { prompt: "$", command: "brew uninstall omm-hippo/omm/omm" },
        ],
        notes: [
          "Removing the formula preserves downloaded models and settings under OMM_HOME.",
          "The Homebrew formula and PyPI package can move on separate release schedules; use brew info omm-hippo/omm/omm to see the version currently provided by the Tap.",
          "omm update does not modify a Homebrew installation and instead prints the matching brew upgrade command.",
        ],
      },
      {
        heading: "Or install the package",
        body: "There is also a plain package install from PyPI. It skips the signed-commit check that the script above performs, and it is the right choice if you already manage your Python tooling.",
        commands: [
          { prompt: "$", command: "python -m pip install omm-model" },
          {
            prompt: "$",
            command: "pipx install omm-model",
            caption: "For an isolated command-line installation, pipx is recommended",
          },
        ],
        notes: [
          "The distribution name is omm-model; the installed command and Python import remain omm.",
          "Upgrade and remove it with the same tool that installed it: python -m pip install --upgrade omm-model, or pipx upgrade omm-model. Both preserve downloaded models and settings under OMM_HOME.",
          "This does not go through the signed-commit verification described above; it relies on PyPI's own account security and TLS, the same trust model as installing any other PyPI package.",
          "omm update only updates a canonical omm Git-source installation. On a pip or pipx install it changes nothing and prints the matching package manager command instead. The Git-only beta channel is likewise unavailable to package-managed installations.",
        ],
      },
    ],
  },

  after: {
    body: "The installer's last line is Done. If 'omm' isn't found, open a new shell (pipx just updated your PATH). Take that literally.",
    steps: [
      {
        step: "01",
        title: "open a new terminal window",
        body: "pipx added its bin directory to your PATH, but a shell that was already running keeps the PATH it started with. A new window or tab is enough.",
      },
      {
        step: "02",
        title: "run omm once",
        body: "A bare omm on a fresh install starts the setup wizard: a hardware summary, then a checklist of local AI runners. Checking one that omm can install on macOS runs its official installer with live progress; checking one it cannot automate here prints a link instead. You can re-run it any time with omm setup.",
        command: { prompt: "$", command: "omm" },
      },
      {
        step: "03",
        title: "check what omm sees",
        body: "omm scan prints the hardware, runner and model summary it will base every fit decision on.",
        command: { prompt: "$", command: "omm scan" },
      },
    ],
    capture: null,
    scanFields: [
      "OS",
      "CPU",
      "RAM (total)",
      "RAM (available)",
      "Safe model budget now",
      "Reserved for apps/OS",
      "GPU",
      "VRAM",
      "Local AI runners — one row per runner, with its status",
    ],
  },

  runners: {
    body: "omm links one central copy of each model into every runner it finds. The setup wizard can install some of those runners for you — which ones depends on the operating system, because it only uses each vendor's own supported package. macOS has the widest coverage of the three.",
    rows: [
      { runner: "Ollama", how: "Automated", automated: true },
      {
        runner: "LM Studio",
        how: "Automated — headless lms CLI",
        automated: true,
      },
      { runner: "Jan", how: "Automated — Homebrew cask", automated: true },
      {
        runner: "AnythingLLM",
        how: "Automated — Homebrew cask",
        automated: true,
      },
      { runner: "Msty", how: "Automated — Homebrew cask", automated: true },
      {
        runner: "KoboldCpp",
        how: "Automated on Apple Silicon; Intel Macs are manual",
        automated: true,
      },
      {
        runner: "text-generation-webui",
        how: "Automated on any Mac",
        automated: true,
      },
    ],
    notes: [
      "The three Homebrew rows need Homebrew installed. Without it the wizard reports Homebrew not found - install manually from … and gives you the vendor's link rather than guessing at a download URL.",
      "KoboldCpp publishes no Intel Mac build, so on an Intel Mac the wizard prints the download page instead of installing.",
      "Every runner already installed is listed in the wizard too, marked as installed rather than hidden, so the checklist always reflects what omm actually detects.",
    ],
    linking: null,
  },

  keeping: {
    storageBody:
      "The model hub and omm's own state default to ~/.omm. Set OMM_HOME before installing, and on later runs, to put them on another volume — useful when your home filesystem does not have room for GGUF files.",
    storageCommands: [
      { prompt: "$", command: "export OMM_HOME=/mnt/models/omm" },
    ],
    storageNotes: [
      "Put that line in your shell profile so later runs see it too. An external volume on macOS lives under /Volumes.",
      "Ollama's own model location follows OLLAMA_MODELS. LM Studio follows its home pointer; set OMM_LMSTUDIO_MODELS_DIR when LM Studio uses a custom directory omm cannot discover.",
    ],
    completionBody:
      "Install tab-completion once, then restart the shell. bash and fish are supported the same way.",
    completionCommand: { prompt: "$", command: "omm --install-completion zsh" },
    uninstallBody:
      "This removes the omm command and the installer-managed source checkouts. Downloaded models and settings under OMM_HOME are preserved.",
    uninstallCommand: {
      prompt: "$",
      command: `curl -fsSL ${RAW}/uninstall.sh | sh`,
    },
    uninstallNotes: [
      "To remove the model hub and settings as well, download the script and run it with --purge. Purge removes only known omm-owned paths and leaves unrelated files in a custom OMM_HOME untouched.",
      "Installers mark custom homes so uninstallers can refuse ambiguous or unsafe locations, and shell profiles are never rewritten during uninstall.",
      "If you installed from PyPI instead, use python -m pip uninstall omm-model or pipx uninstall omm-model. Both preserve models and settings.",
    ],
  },

  trouble: [
    {
      see: "Nothing at all. The command returns immediately and no omm appears.",
      why: "curl -fsSL is deliberately quiet: -s hides its progress and errors, -f makes it exit silently on an HTTP error. A blocked network or a proxy therefore looks like nothing happening.",
      fix: "Download the script on its own first so you can read the error, then run it: curl -fL https://raw.githubusercontent.com/omm-hippo/omm/main/install.sh -o install.sh && sh install.sh",
      source: "README, Install section — the curl flags in the command itself",
    },
    {
      see: "Python 3.10+ not found: https://www.python.org/downloads/",
      why: "No python3 or python of version 3.10 or newer was found. On macOS the installer cannot fix this itself — its automatic bootstrap is apt-based and apt does not exist here.",
      fix: "Install Python 3.10 or newer from python.org, or with Homebrew, open a new terminal window, then run the install command again.",
      source: "install.sh:135",
    },
    {
      see: "git not found. Install git first (needed to fetch omm from GitHub).",
      why: "omm is installed from a verified Git checkout. On a Mac without the Xcode Command Line Tools there is no usable git.",
      fix: "Run xcode-select --install, let it finish, then run the install command again. If macOS opened its own Command Line Tools dialog, accepting that has the same effect.",
      source: "install.sh:148",
    },
    {
      see: "git 2.34+ is required to verify SSH commit signatures (found git version 2.30.0).",
      why: "Your git is too old to check SSH commit signatures. The installer treats cannot verify exactly like a bad signature.",
      fix: "Update git — brew install git, or reinstall the Command Line Tools — then run the install command again.",
      source: "install.sh:81",
    },
    {
      see: "Signature verification failed - refusing to install untrusted code.",
      why: "The staged commit was not signed by a key in the installer's trust anchor — or git could not check the signature at all, as in the previous entry.",
      fix: "Update git and retry. If it still fails, do not work around it with a plain git clone: open an issue on the repository instead.",
      source: "install.sh:396",
    },
    {
      see: "error: externally-managed-environment",
      why: "A Homebrew or other PEP 668 Python refuses plain pip installs. The installer already expects this and retries pipx's own install with --break-system-packages.",
      fix: "Nothing, if the install continues past it. If it stops there, install pipx yourself (brew install pipx && pipx ensurepath) and run the install command again.",
      source: "install.sh:327-336",
    },
    {
      see: "Could not inspect existing pipx environments; refusing an unsafe migration.",
      why: "pipx list --json did not return usable output, so the installer cannot tell what it would be replacing. It stops instead of guessing.",
      fix: "Check that pipx runs on its own (python3 -m pipx list), repair it if not, then run the install command again.",
      source: "install.sh:343",
    },
    {
      see: "Refusing to replace unrelated pipx environment 'omm'. Remove or rename that environment manually first.",
      why: "An unrelated PyPI project also called omm already owns that pipx environment. The installer will not overwrite someone else's tool.",
      fix: "Run pipx uninstall omm if you do not need that other tool, or rename its environment, then run the install command again.",
      source: "install.sh:351",
    },
    {
      see: "Refusing to replace an unverified omm-model pipx environment.",
      why: "An omm-model pipx environment exists but does not look like one omm created.",
      fix: "Run pipx uninstall omm-model, then run the install command again.",
      source: "install.sh:361",
    },
    {
      see: "zsh: command not found: omm",
      why: "The install finished, but this shell still has the PATH it started with.",
      fix: "Open a new terminal window. The installer prints the same advice on its last line.",
      source: "install.sh:508",
    },
    {
      see: "Refusing non-absolute OMM_HOME: models/omm",
      why: "OMM_HOME has to be an absolute path. A sibling message, Refusing unsafe OMM_HOME, means it points at / or at your home directory itself.",
      fix: "Use a full path to a subdirectory, for example export OMM_HOME=/Volumes/Models/omm.",
      source: "install.sh:11 and install.sh:14",
    },
    {
      see: "Homebrew not found - install manually from https://docs.anythingllm.com/installation-desktop/overview",
      why: "This is the setup wizard, not the installer: the three Homebrew-based runners need brew on PATH. omm never guesses a direct download URL.",
      fix: "Install Homebrew and re-run omm setup, or install that runner yourself from the printed link — omm links models into it either way.",
      source: "src/omm/linker.py:2104-2108",
    },
    {
      see: "Refusing unrecognized custom OMM_HOME (missing .omm-managed): /Volumes/Models/omm",
      why: "You are uninstalling with a custom OMM_HOME that the installer never marked as its own, so the uninstaller cannot prove the folder is safe to touch.",
      fix: "Check that OMM_HOME points at the folder omm actually installed into, then run the uninstaller again.",
      source: "uninstall.sh:42",
    },
  ],
};

/* ========================================================================== */
/* Linux                                                                      */
/* ========================================================================== */

const LINUX: Guide = {
  slug: "linux",
  os: "Linux",
  metaTitle: "Install omm on Linux",
  metaDescription:
    "Step-by-step omm install for Linux: the one-line installer, what it bootstraps through apt and what it leaves to you on Fedora, Arch and openSUSE, plus what each installer error message means.",
  heading: "Install omm on Linux",
  lede: "One command in any terminal. On Debian and Ubuntu the installer can fetch its own dependencies; on other distributions you install python3 and git first, and everything after that is identical.",

  app: {
    heading: "Open a terminal",
    body: "Any terminal emulator works — GNOME Terminal, Konsole, xterm, Alacritty. The command runs under sh, so your login shell being bash, zsh or fish makes no difference.",
    open: [
      "Most desktops open a terminal with Ctrl, Alt and T together.",
      "Otherwise find Terminal, Konsole or Console in your application menu.",
      "You do not need to be root. The installer asks for sudo only if it has to install packages through apt.",
    ],
    samplesIntro: "The prompt tells you which shell you are in. All of these are fine.",
    samples: [
      { sample: "you@host:~$", program: "bash — the common default", ok: true },
      { sample: "you@host ~ %", program: "zsh", ok: true },
      { sample: "root@host:~#", program: "a root shell — also works", ok: true },
    ],
    notes: [
      "omm is tested in CI on Linux with Python 3.10+.",
    ],
  },

  before: {
    body: "The installer's automatic dependency bootstrap is apt-only. On Debian and Ubuntu it can install everything it needs; anywhere else it checks and reports rather than installing.",
    requirements: [
      {
        label: "Python 3.10+",
        body: "Required. On a system with apt the installer runs apt-get install python3 python3-venv python3-pip when python3 is missing. Elsewhere, install it yourself first.",
        links: [
          { label: "python.org/downloads", href: "https://www.python.org/downloads/" },
        ],
      },
      {
        label: "git",
        body: "Required, because omm is installed from a verified Git checkout. With apt present the installer adds git and ca-certificates for you.",
        links: [
          { label: "git-scm.com/downloads", href: "https://git-scm.com/downloads" },
        ],
      },
      {
        label: "python3-venv",
        body: "Needed by pipx, and packaged separately on Debian and Ubuntu. Without it pipx fails with a confusing ensurepip is not available, so the installer bootstraps it explicitly.",
      },
      {
        label: "Fedora, Arch, openSUSE, Alpine",
        body: "No apt, so no bootstrap. Install Python 3.10+ and git with your own package manager first — for example sudo dnf install python3 git or sudo pacman -S python git.",
      },
      {
        label: "root or sudo",
        body: "The apt step runs directly as root, or through sudo when it is available. Without either it is skipped, and the installer then reports the missing dependency instead.",
      },
    ],
  },

  install: {
    body: "Paste this into your terminal and press Enter.",
    command: {
      prompt: "$",
      command: `curl -fsSL ${RAW}/install.sh | sh`,
    },
    notes: [
      "curl downloads the script and sh runs it. It installs omm as an isolated CLI through pipx.",
      "Open a new shell afterward so your PATH picks up omm.",
      "The -f and -s flags make curl silent on failure. If nothing at all happens, see the troubleshooting section below.",
    ],
    alts: [
      {
        heading: "Or install the package",
        body: "There is also a plain package install from PyPI. It skips the signed-commit check that the script above performs, and it is the right choice if you already manage your Python tooling.",
        commands: [
          { prompt: "$", command: "python -m pip install omm-model" },
          {
            prompt: "$",
            command: "pipx install omm-model",
            caption: "For an isolated command-line installation, pipx is recommended",
          },
        ],
        notes: [
          "The distribution name is omm-model; the installed command and Python import remain omm.",
          "Upgrade and remove it with the same tool that installed it: python -m pip install --upgrade omm-model, or pipx upgrade omm-model. Both preserve downloaded models and settings under OMM_HOME.",
          "This does not go through the signed-commit verification described above; it relies on PyPI's own account security and TLS, the same trust model as installing any other PyPI package.",
          "omm update only updates a canonical omm Git-source installation. On a pip or pipx install it changes nothing and prints the matching package manager command instead. The Git-only beta channel is likewise unavailable to package-managed installations.",
        ],
      },
    ],
  },

  after: {
    body: "The installer's last line is Done. If 'omm' isn't found, open a new shell (pipx just updated your PATH). Take that literally.",
    steps: [
      {
        step: "01",
        title: "open a new shell",
        body: "pipx added its bin directory to your PATH, but a shell that was already running keeps the PATH it started with. A new terminal window or tab is enough.",
      },
      {
        step: "02",
        title: "run omm once",
        body: "A bare omm on a fresh install starts the setup wizard: a hardware summary, then a checklist of local AI runners. Checking one that omm can install on Linux runs its official installer with live progress; checking one it cannot automate here prints a link instead. You can re-run it any time with omm setup.",
        command: { prompt: "$", command: "omm" },
      },
      {
        step: "03",
        title: "check what omm sees",
        body: "omm scan prints the hardware, runner and model summary it will base every fit decision on.",
        command: { prompt: "$", command: "omm scan" },
      },
    ],
    capture: null,
    scanFields: [
      "OS",
      "CPU",
      "RAM (total)",
      "RAM (available)",
      "Safe model budget now",
      "Reserved for apps/OS",
      "GPU",
      "VRAM",
      "Local AI runners — one row per runner, with its status",
    ],
  },

  runners: {
    body: "omm links one central copy of each model into every runner it finds. The setup wizard can install some of those runners for you — which ones depends on the operating system, because it only uses each vendor's own supported package.",
    rows: [
      { runner: "Ollama", how: "Automated", automated: true },
      {
        runner: "LM Studio",
        how: "Automated — headless lms CLI",
        automated: true,
      },
      { runner: "Jan", how: "Automated — Flatpak", automated: true },
      { runner: "KoboldCpp", how: "Automated on x86_64", automated: true },
      {
        runner: "text-generation-webui",
        how: "Automated on x86_64",
        automated: true,
      },
      {
        runner: "AnythingLLM",
        how: "Manual — install it yourself, omm still links to it",
        automated: false,
      },
      {
        runner: "Msty",
        how: "Manual — install it yourself, omm still links to it",
        automated: false,
      },
    ],
    notes: [
      "Manual here means only that the wizard will not run the vendor's installer for you; it prints the download link, and once the app exists omm detects and links it like any other runner.",
      "Jan needs flatpak on PATH. Without it the wizard reports flatpak not found - install manually from https://jan.ai/download.",
      "AnythingLLM's only official Linux install is an interactive installer that prompts for an AppArmor profile and has no documented silent flag, and Msty has no Linux package at all — which is why neither is automated here.",
      "KoboldCpp and text-generation-webui publish x86_64 Linux builds only, so on ARM the wizard prints the download page instead.",
    ],
    linking: null,
  },

  keeping: {
    storageBody:
      "The model hub and omm's own state default to ~/.omm. Set OMM_HOME before installing, and on later runs, to put them on another volume — useful when your home filesystem does not have room for GGUF files.",
    storageCommands: [
      { prompt: "$", command: "export OMM_HOME=/mnt/models/omm" },
    ],
    storageNotes: [
      "Put that line in your shell profile so later runs see it too.",
      "Ollama's own model location follows OLLAMA_MODELS. LM Studio follows its home pointer; set OMM_LMSTUDIO_MODELS_DIR when LM Studio uses a custom directory omm cannot discover.",
    ],
    completionBody:
      "Install tab-completion once, then restart the shell. zsh and fish are supported the same way.",
    completionCommand: { prompt: "$", command: "omm --install-completion bash" },
    uninstallBody:
      "This removes the omm command and the installer-managed source checkouts. Downloaded models and settings under OMM_HOME are preserved.",
    uninstallCommand: {
      prompt: "$",
      command: `curl -fsSL ${RAW}/uninstall.sh | sh`,
    },
    uninstallNotes: [
      "To remove the model hub and settings as well, download the script and run it with --purge. Purge removes only known omm-owned paths and leaves unrelated files in a custom OMM_HOME untouched.",
      "Installers mark custom homes so uninstallers can refuse ambiguous or unsafe locations, and shell profiles are never rewritten during uninstall.",
      "If you installed from PyPI instead, use python -m pip uninstall omm-model or pipx uninstall omm-model. Both preserve models and settings.",
    ],
  },

  trouble: [
    {
      see: "Nothing at all. The command returns immediately and no omm appears.",
      why: "curl -fsSL is deliberately quiet: -s hides its progress and errors, -f makes it exit silently on an HTTP error. A blocked network or a proxy therefore looks like nothing happening.",
      fix: "Download the script on its own first so you can read the error, then run it: curl -fL https://raw.githubusercontent.com/omm-hippo/omm/main/install.sh -o install.sh && sh install.sh",
      source: "README, Install section — the curl flags in the command itself",
    },
    {
      see: "Python 3.10+ not found: https://www.python.org/downloads/",
      why: "No python3 or python of version 3.10 or newer was found. The installer's automatic bootstrap only runs where apt-get exists, and even there it gives up quietly if apt fails.",
      fix: "Install Python 3.10 or newer with your distribution's package manager — sudo apt install python3 python3-venv python3-pip, sudo dnf install python3, sudo pacman -S python — then run the install command again.",
      source: "install.sh:122-135",
    },
    {
      see: "git not found. Install git first (needed to fetch omm from GitHub).",
      why: "omm is installed from a verified Git checkout, and git was neither present nor installable through apt here.",
      fix: "Install git with your own package manager, then run the install command again.",
      source: "install.sh:141-150",
    },
    {
      see: "python3-venv not found (needed by pipx), installing it via apt...",
      why: "Informational. On Debian and Ubuntu, ensurepip lives in a separate package; without it pipx fails with ensurepip is not available.",
      fix: "Nothing, if the install continues. On a non-apt distribution install the equivalent package yourself — python3-virtualenv or your distribution's python3 venv package.",
      source: "install.sh:152-155",
    },
    {
      see: "git 2.34+ is required to verify SSH commit signatures (found git version 2.30.0).",
      why: "Your git is too old to check SSH commit signatures. The installer treats cannot verify exactly like a bad signature.",
      fix: "Update git, then run the install command again.",
      source: "install.sh:81",
    },
    {
      see: "Signature verification failed - refusing to install untrusted code.",
      why: "The staged commit was not signed by a key in the installer's trust anchor — or git could not check the signature at all, as in the previous entry.",
      fix: "Update git and retry. If it still fails, do not work around it with a plain git clone: open an issue on the repository instead.",
      source: "install.sh:396",
    },
    {
      see: "Could not inspect existing pipx environments; refusing an unsafe migration.",
      why: "pipx list --json did not return usable output, so the installer cannot tell what it would be replacing. It stops instead of guessing.",
      fix: "Check that pipx runs on its own (python3 -m pipx list), repair it if not, then run the install command again.",
      source: "install.sh:343",
    },
    {
      see: "Refusing to replace unrelated pipx environment 'omm'. Remove or rename that environment manually first.",
      why: "An unrelated PyPI project also called omm already owns that pipx environment. The installer will not overwrite someone else's tool.",
      fix: "Run pipx uninstall omm if you do not need that other tool, or rename its environment, then run the install command again.",
      source: "install.sh:351",
    },
    {
      see: "Refusing to replace an unverified omm-model pipx environment.",
      why: "An omm-model pipx environment exists but does not look like one omm created.",
      fix: "Run pipx uninstall omm-model, then run the install command again.",
      source: "install.sh:361",
    },
    {
      see: "bash: omm: command not found",
      why: "The install finished, but this shell still has the PATH it started with.",
      fix: "Open a new shell. The installer prints the same advice on its last line.",
      source: "install.sh:508",
    },
    {
      see: "Refusing non-absolute OMM_HOME: models/omm",
      why: "OMM_HOME has to be an absolute path. A sibling message, Refusing unsafe OMM_HOME, means it points at / or at your home directory itself.",
      fix: "Use a full path to a subdirectory, for example export OMM_HOME=/mnt/models/omm.",
      source: "install.sh:11 and install.sh:14",
    },
    {
      see: "flatpak not found - install manually from https://jan.ai/download",
      why: "This is the setup wizard, not the installer: Jan's only automated Linux path is Flatpak. omm never guesses a direct download URL.",
      fix: "Install flatpak and add the Flathub remote, then re-run omm setup — or install Jan yourself from the printed link. omm links models into it either way.",
      source: "src/omm/linker.py:2116-2121",
    },
    {
      see: "Refusing unrecognized custom OMM_HOME (missing .omm-managed): /mnt/models/omm",
      why: "You are uninstalling with a custom OMM_HOME that the installer never marked as its own, so the uninstaller cannot prove the folder is safe to touch.",
      fix: "Check that OMM_HOME points at the folder omm actually installed into, then run the uninstaller again.",
      source: "uninstall.sh:42",
    },
  ],
};

export const GUIDES: Record<Slug, Guide> = {
  windows: WINDOWS,
  macos: MACOS,
  linux: LINUX,
};

export const GUIDE_ORDER: readonly Slug[] = ["windows", "macos", "linux"];

/** Used by the chooser page, the Install section tabs, the nav and the footer. */
export const GUIDE_LINKS: readonly {
  readonly slug: Slug;
  readonly os: string;
  readonly href: string;
  readonly summary: string;
}[] = [
  {
    slug: "windows",
    os: "Windows",
    href: "/install/windows",
    summary:
      "PowerShell, the TLS pre-line, winget bootstrapping, and the hard-link-then-symlink-then-copy strategy.",
  },
  {
    slug: "macos",
    os: "macOS",
    href: "/install/macos",
    summary:
      "Terminal, why the bundled Python is usually too old, and the Homebrew-backed runner coverage.",
  },
  {
    slug: "linux",
    os: "Linux",
    href: "/install/linux",
    summary:
      "Any terminal, what the apt bootstrap does, and what to install yourself on Fedora, Arch or openSUSE.",
  },
];
