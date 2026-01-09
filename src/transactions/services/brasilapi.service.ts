import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class BrasilApiService {
  private readonly logger = new Logger(BrasilApiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BRASILAPI_BASE_URL') || 'https://brasilapi.com.br/api';
  }

  async validateBank(code: string): Promise<{ code: string; name: string } | null> {
    try {
      const response$ = this.httpService.get(`${this.baseUrl}/banks/v1/${code}`).pipe(
        timeout(5000),
      );

      const response = await firstValueFrom(response$);

      return {
        code: response.data.code,
        name: response.data.name,
      };
    } catch (error) {
      this.logger.error(`Failed to validate bank code ${code}:`, error.message);
      return null;
    }
  }
}
