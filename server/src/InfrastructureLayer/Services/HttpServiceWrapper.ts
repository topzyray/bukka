import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpServiceWrapper {
  constructor(private httpService: HttpService) {}

  async get(url: string, headers?: any): Promise<AxiosResponse<any>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`HTTP GET Error: ${error.message}`);
    }
  }

  async post(
    url: string,
    body: any,
    headers?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<any>> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers, ...options }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`HTTP POST Error: ${error.message}`);
    }
  }

  async put(
    url: string,
    body: any,
    headers?: any,
  ): Promise<AxiosResponse<any>> {
    try {
      const response = await firstValueFrom(
        this.httpService.put(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`HTTP PUT Error: ${error.message}`);
    }
  }

  async delete(url: string, headers?: any): Promise<AxiosResponse<any>> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`HTTP DELETE Error: ${error.message}`);
    }
  }
}
