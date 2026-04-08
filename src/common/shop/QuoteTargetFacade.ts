import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { View } from '../../lib/ui/controllers/views/View.js';

export interface QuoteProjectInfoDataSource {
  isProjectSelectedInProjectInfoFragment(f: QuoteProjectInfoFragment, projectId: string): boolean;
}

export interface QuoteProjectInfoDelegate {
  onClickInProjectInfoFragment(f: QuoteProjectInfoFragment, projectId: string): void;
}

export interface QuoteProjectInfoFragment extends Fragment {
  setProjectId(id: string): void;
  setDataSource(dataSource: QuoteProjectInfoDataSource): void;
  setDelegate(delegate: QuoteProjectInfoDelegate): void;
}

export interface QuoteProductInfoDataSource {
  isProductSelectedInProductInfoFragmetn(f: QuoteProductInfoFragment, productId: string): boolean;
}

export interface QuoteProductInfoDelegate {
  onClickInProductInfoFragment(f: QuoteProductInfoFragment, productId: string): void;
}

export interface QuoteProductInfoFragment extends Fragment {
  setProductId(id: string): void;
  setDataSource(dataSource: QuoteProductInfoDataSource): void;
  setDelegate(delegate: QuoteProductInfoDelegate): void;
}

type ProjectInfoFactory = () => QuoteProjectInfoFragment | null;
type ProductInfoFactory = () => QuoteProductInfoFragment | null;
type ProjectViewFactory = (projectId: string) => View | null;
type ProductViewFactory = (productId: string) => View | null;

let gProjectInfoFactory: ProjectInfoFactory | null = null;
let gProductInfoFactory: ProductInfoFactory | null = null;
let gProjectViewFactory: ProjectViewFactory | null = null;
let gProductViewFactory: ProductViewFactory | null = null;

export class QuoteTargetFacade {
  static registerProjectInfoFactory(factory: ProjectInfoFactory): void {
    gProjectInfoFactory = factory;
  }

  static registerProductInfoFactory(factory: ProductInfoFactory): void {
    gProductInfoFactory = factory;
  }

  static registerProjectViewFactory(factory: ProjectViewFactory): void {
    gProjectViewFactory = factory;
  }

  static registerProductViewFactory(factory: ProductViewFactory): void {
    gProductViewFactory = factory;
  }

  static createProjectInfoFragment(): QuoteProjectInfoFragment | null;
  static createProjectInfoFragment(
    projectId: string,
    dataSource?: QuoteProjectInfoDataSource,
    delegate?: QuoteProjectInfoDelegate
  ): QuoteProjectInfoFragment | null;
  static createProjectInfoFragment(
    projectId?: string,
    dataSource?: QuoteProjectInfoDataSource,
    delegate?: QuoteProjectInfoDelegate
  ): QuoteProjectInfoFragment | null {
    const f = gProjectInfoFactory ? gProjectInfoFactory() : null;
    if (!f) {
      return null;
    }
    if (projectId !== undefined) {
      f.setProjectId(projectId);
    }
    if (dataSource) {
      f.setDataSource(dataSource);
    }
    if (delegate) {
      f.setDelegate(delegate);
    }
    return f;
  }

  static createProductInfoFragment(): QuoteProductInfoFragment | null;
  static createProductInfoFragment(
    productId: string,
    dataSource?: QuoteProductInfoDataSource,
    delegate?: QuoteProductInfoDelegate
  ): QuoteProductInfoFragment | null;
  static createProductInfoFragment(
    productId?: string,
    dataSource?: QuoteProductInfoDataSource,
    delegate?: QuoteProductInfoDelegate
  ): QuoteProductInfoFragment | null {
    const f = gProductInfoFactory ? gProductInfoFactory() : null;
    if (!f) {
      return null;
    }
    if (productId !== undefined) {
      f.setProductId(productId);
    }
    if (dataSource) {
      f.setDataSource(dataSource);
    }
    if (delegate) {
      f.setDelegate(delegate);
    }
    return f;
  }

  static createProjectView(projectId: string): View | null {
    return gProjectViewFactory ? gProjectViewFactory(projectId) : null;
  }

  static createProductView(productId: string): View | null {
    return gProductViewFactory ? gProductViewFactory(productId) : null;
  }
}

export default QuoteTargetFacade;
