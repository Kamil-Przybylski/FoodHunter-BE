import { AuthService } from './auth.service';
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get()
  testGet() {
    return this.authService.getAll();
  }

}
