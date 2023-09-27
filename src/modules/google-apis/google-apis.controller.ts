import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleApisService } from './google-apis.service';
import to from 'await-to-js';
import {
 GeoCodingDto
} from './google-apis.dto';
import { Auth } from 'src/common/decorators/auth.decorators';
import { User } from 'src/common/decorators/user.decorators';
import { IUser } from 'src/interfaces/IUser.interface';

@ApiTags('Google APIs')
@Controller('google-apis')
export class GoogleApisController {
  constructor(private readonly googleApisService: GoogleApisService) {}

  @ApiOperation({
    summary: 'Get Endpoint (WITH AUTHENTICATION)',
    description: 'Endpoint to search nearby restaurants by coordinates or city',
  })
  @Auth()
  @Get('nearby-restaurants')
  async getNearbyRestaurants(@Query() geocodingDTO: GeoCodingDto, @User() user: IUser) {
    const { latitude, longitude, city } = geocodingDTO;

    if ((!latitude && !longitude) && !city) {
      throw new BadRequestException('Se debe enviar una dirección, latitud y longitud, o ciudad');
    }

    if ((latitude && !longitude) || (!latitude && longitude)) {
      throw new BadRequestException('Si se envía una latitud o una longitud, se debe enviar la otra');
    }

    let coordinates: string;
    if (latitude && longitude) {
      coordinates = `${latitude},${longitude}`;
    } else {
      // Si no se proporcionan latitud y longitud, buscar por ciudad
      coordinates = await this.googleApisService.getCoordinatesByCity(city, user.id);
    }

    const [error, response] = await to(
      this.googleApisService.getNearbyRestaurants(coordinates, user.id),
    );

    if (error) throw new BadRequestException(error);
    return response;
  }
}