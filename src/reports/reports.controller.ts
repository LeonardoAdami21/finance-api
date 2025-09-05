import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ReportQueryDto } from './dto/report.query.dto';

@Controller('reports')
@ApiBearerAuth()
@ApiTags('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({
    summary: 'Obter resumo de despesas',
    description: 'Obter resumo de despesas',
  })
  @ApiOkResponse({ description: 'Resumo de despesas obtido com sucesso' })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao obter resumo de despesas',
  })
  @Get('summary')
  getSummary(@Request() req: any, @Query() query: ReportQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;
    return this.reportsService.getSummary(req.user.id, startDate, endDate);
  }

  @ApiOperation({
    summary: 'Obter relatório de despesas por categoria',
    description: 'Obter relatório de despesas por categoria',
  })
  @ApiOkResponse({
    description: 'Relatório de despesas por categoria obtido com sucesso',
  })
  @Get('spending-by-category')
  getSpendingByCategory(@Request() req: any, @Query() query: ReportQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;
    return this.reportsService.getSpendingByCategory(
      req.user.id,
      startDate,
      endDate,
    );
  }
}
