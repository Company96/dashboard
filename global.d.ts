// global.d.ts
interface Window {
  google: {
    translate: {
      TranslateElement: new (options: any, element: string) => void;
    };
  };
  googleTranslateElementInit: () => void;
  smartsupp: any;
}
