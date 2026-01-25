import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';
import {
  CreateOrderDto,
  OrderFilterDto,
  UpdateOrderDto,
} from 'src/DomainLayer/Dtos/OrderDto';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { OrderRepository } from 'src/BusinessLayer/OrderRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/business/orders`)
@ApiTags('Orders')
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() dto: CreateOrderDto, @Res() res: Response) {
    const response = await this.orderRepository.createOrder(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with filters' })
  async getOrders(@Query() filter: OrderFilterDto, @Res() res: Response) {
    const response = await this.orderRepository.getOrdersByFilters(filter);
    const data = BukkaResponse.GetPagedDataResponse('Orders', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get a order by ID' })
  @ApiParam({ name: 'orderId', example: 1 })
  async getOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const response = await this.orderRepository.getOrderById(orderId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put()
  @ApiOperation({ summary: 'Update a order by ID' })
  @ApiBody({ type: UpdateOrderDto })
  async updateOrder(@Body() dto: UpdateOrderDto, @Res() res: Response) {
    const response = await this.orderRepository.updateOrder(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Delete a order by ID' })
  @ApiParam({ name: 'orderId', example: 1 })
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const response = await this.orderRepository.deleteOrder(orderId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
