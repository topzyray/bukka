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
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateMenuDto,
  MenuFilterDto,
  UpdateMenuDto,
} from 'src/DomainLayer/Dtos/MenuDto';
import { MenuRepository } from 'src/BusinessLayer/MenuRepository';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/business/menus`)
@ApiTags('Menus')
export class MenuController {
  constructor(private readonly menuRepository: MenuRepository) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiBody({ type: CreateMenuDto })
  async createMenu(@Body() dto: CreateMenuDto, @Res() res: Response) {
    const response = await this.menuRepository.createMenu(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  async getMenus(@Query() filter: MenuFilterDto, @Res() res: Response) {
    const response = await this.menuRepository.getMenusByFilters(filter);
    const data = BukkaResponse.GetPagedDataResponse('Menus', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':menuId')
  async getMenuById(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Res() res: Response,
  ) {
    const response = await this.menuRepository.getMenuById(menuId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a new menu' })
  @ApiBody({ type: UpdateMenuDto })
  async updateMenu(@Body() dto: UpdateMenuDto, @Res() res: Response) {
    const response = await this.menuRepository.updateMenu(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':menuId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a menu by ID' })
  @ApiParam({ name: 'menuId', example: 1 })
  async deleteMenu(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Res() res: Response,
  ) {
    const response = await this.menuRepository.deleteMenu(menuId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
