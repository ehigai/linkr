import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  landingPage() {
    return {
      message: 'Welcome to Linkr!',
    };
    //return this.appService.landingPage();
  }

  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @Get('signup')
  @Render('signup')
  signupPage() {
    return {};
  }
}
