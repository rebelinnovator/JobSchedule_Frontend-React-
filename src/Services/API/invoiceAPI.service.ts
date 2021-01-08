import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { IInvoice } from '../../Models/invoiceItem';

export class InvoiceAPI extends BaseAPIService {
  async load(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/invoices`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async loadSublist(id: string, params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/invoices/${id}`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async loadOne(id: string, params = {}, jobType = 3): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/invoices/${id}/timesheets/${jobType}`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async create(invoice: IInvoice): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/invoices',
      invoice,
      {
        withDetailErrors: true,
      },
    );
  }

  async download(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/invoices/${id}/excel`,
      {},
      {
        withDetailErrors: true,
        responseType: 'blob'
      },
    );
  }
}

export default new InvoiceAPI();
