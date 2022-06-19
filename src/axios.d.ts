import 'axios'

declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfg): Promise<T>
    <T = any>(url: string, config?: AxiosRequestConfg): Promise<T>
    defaults: AxiosRequestConfg
    interceptors: {
      request: AxiosInterceptorManager<AxiosRequestConfg>
      response: AxiosInterceptorManager<AxiosResponse>
    }
    getUri(config?: AxiosRequestConfg): string
    request<T = any, R = AxiosResponse<T>>(
      config: AxiosRequestConfg
    ): Promise<R>
    get<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfg
    ): Promise<R>
    delete<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfg
    ): Promise<R>
    head<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfg
    ): Promise<R>
    options<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfg
    ): Promise<R>
    post<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfg
    ): Promise<R>
    put<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfg
    ): Promise<R>
    patch<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfg
    ): Promise<R>
  }
}
