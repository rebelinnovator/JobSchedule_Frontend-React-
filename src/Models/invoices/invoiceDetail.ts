export class InvoiceDetail {
  id?: string;
  dateOfService?: string;
  deparment?: string;
  section?: string;
  po?: string;
  billed?: boolean;
  conEdTicket?: string;
  requestor?: string;
  requestTime?: string;
  suppervisor?: string;
  solutionJobTicket?: string;
  locationAddress?: string;
  muni?: string;
  flaggerName?: string;
  flaggerEmployee?: string;
  tsRecived?: string;
  startDateTime?: string;
  endDateTime?: string;
  hourBreakTaken?: boolean;
  totalHoursWorked?: number;
  regularHours?: number;
  overtimeHours?: number;
  holidayHours?: number;
  totalInvoiceAmount?: number;
  comment?: string;
  edit?:boolean;
  checked?:boolean;

}
