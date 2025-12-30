
export class FPostBase extends ui.Fragment {
  isInfoClickable() { return true; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FPostBase = FPostBase;
}
