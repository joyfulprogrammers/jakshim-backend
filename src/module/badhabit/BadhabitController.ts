import { Controller, UseGuards } from '@nestjs/common';
import { BadhabitService } from './BadhabitService';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BADHABIT')
@UseGuards(LoggedInGuard)
@Controller('api/badhabit')
export class BadhabitController {
  constructor(private readonly badhabitService: BadhabitService) {}
}
