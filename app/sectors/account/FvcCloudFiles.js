export class FvcCloudFiles extends ui.FScrollViewContent {}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcCloudFiles = FvcCloudFiles;
}
