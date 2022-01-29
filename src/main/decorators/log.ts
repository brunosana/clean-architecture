import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  constructor (controller: Controller) {
    this.controller = controller;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpRequest === 500) {
      // log aqui
    }

    return httpResponse;
  }
}

export { LogControllerDecorator };
