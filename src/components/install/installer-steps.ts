/** README "Supported platforms": "Both installers clone to a versioned staging
 *  directory, verify the signed commit against a bootstrap trust anchor, and
 *  only then switch pipx to it."
 *
 *  Shared by the Install section on the landing page and by the three per-OS
 *  install guides, so the three steps are worded once. */
export const INSTALLER_STEPS: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "01",
    title: "staging clone",
    body: "The release is cloned into a versioned staging directory, never over the copy you are currently running.",
  },
  {
    step: "02",
    title: "signed commit verified",
    body: "The staged commit is checked against a bootstrap trust anchor before any of it is executed.",
  },
  {
    step: "03",
    title: "pipx switch",
    body: "Only after that does pipx switch to the staged tree, so omm stays an isolated CLI.",
  },
];
