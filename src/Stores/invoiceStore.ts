import { observable, action, computed } from 'mobx';
import { TableItem } from '../Containers/Components/TableList/TableItem';
import { string } from 'prop-types';
import { InvoiceDetail } from '../Models/invoices/invoiceDetail';
import { ControlType } from '../Utils/ControlType';
import { IInvoice, InvoiceItem } from '../Models/invoiceItem';
import { invoiceAPI } from '../Services/API';
import { DEPARTMENT_GROUPS } from '../Constants/user';
import moment from 'moment';

const emptyPagination = { page: 1, totalPage: 0, total: 0, limit: 10 };
interface Invoice {
  timesheets: InvoiceItem[];
  departmentType: number;
  startDate: string;
  endDate: string;
}
class InvoiceStore {
  @observable headers = [];
  @observable sources = [];

  @observable list: IInvoice[] = [];
  @observable sublist: IInvoice[] = [];
  @observable pagination = emptyPagination;
  @observable invoicePagination = emptyPagination;

  @observable invoice: Invoice = {
    departmentType: DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP,
    timesheets: [],
    startDate: undefined,
    endDate: undefined,
  }

  constructor() {
    this.list = [];
    this.ConfigTable()
  }

  async getList(params: any = {}) {
    const {
      data: { results, page, totalPage, total, limit },
    } = await invoiceAPI.load(params);
    if (!results) {
      this.list = [];
      return;
    }

    this.list = results as IInvoice[];
    this.pagination = { page, totalPage, total, limit };
  }

  async getSubList(id: string, params: any = {}) {
    const {
      data: { timesheets },
    } = await invoiceAPI.loadSublist(id, params);
    if (!timesheets) {
      this.sublist = [];
      return;
    }

    this.sublist = timesheets as IInvoice[];
  }

  @action getInvoice = async (id, params?: any, jobType = 3) => {
    const { data: { timesheets, departmentType, startDate, endDate } } = await invoiceAPI.loadOne(id, params, jobType);
    const { results, page, totalPage, total, limit } = timesheets;
    if (!results) {
      this.invoice = {
        timesheets: [],
        departmentType: DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP,
        startDate: undefined,
        endDate: undefined,
      };
      return;
    }


    this.invoicePagination = { page, totalPage, total, limit };
    this.invoice = {
      departmentType,
      startDate,
      endDate,
      timesheets: results,
    };
  }

  @action ConfigTable() {
    this.sources = new Array<InvoiceDetail>();
  }

}
export default new InvoiceStore;
