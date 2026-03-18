import { SupplierOrderBase } from './SupplierOrderBase.js';
import type { SupplierOrderPublicData } from '../../types/backend2.js';

export class SupplierOrderPublic<T extends SupplierOrderPublicData> extends SupplierOrderBase<T> {}

