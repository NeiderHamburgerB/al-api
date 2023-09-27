import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';
import { lastValueFrom } from 'rxjs';
import { GOOGLE_APIS_URLS } from './utils';
import { TransactionService } from '../transaction/transaction.service';
import { TypeTransaction } from 'src/models/transaction/transaction.entity';

@Injectable()
export class GoogleApisService {
  
  constructor(private readonly _httpService: HttpService, private transactionService: TransactionService) {}

  async getNearbyRestaurants(location: string, user_id: number) {

    const radius = 5000; // Radio en metros para buscar restaurantes cercanos
    const endpoint = `${GOOGLE_APIS_URLS.URI_NEARBY_SEARCH}`
    // envió req a google
    const data = this._httpService
      .get(endpoint, {
        params: {
          key: process.env.KEY_GOOGLE,
          location,
          radius: radius.toString(),
          type: 'restaurant',
        },
      })

    const [error, response] = await to(lastValueFrom(data));

    if (error) {
      throw new InternalServerErrorException(error);
    }

    //create transaction
    const [errorTransaction, transaction] = await to(this.transactionService.create({user_id,transaction_type:TypeTransaction.COORDENADAS, search_location:location}))

    if (errorTransaction) {
      throw new InternalServerErrorException(errorTransaction);
    }

    if (response.data.results.length) {
      return { results: response.data.results };
    }

  }

  async getCoordinatesByCity(city: string,user_id: number) {
    
    const endpoint = `${GOOGLE_APIS_URLS.URI_GEOCODE_SEARCH}`;
    
    const data = this._httpService
      .get(endpoint, {
        params: {
          address: city,
          key: process.env.KEY_GOOGLE,
          type: 'restaurant',
        },
      })
      
    const [error, response] = await to(lastValueFrom(data));

    if (error) {
      throw new InternalServerErrorException(error);
    }

    //create transaction
    const [errorTransaction, transaction] = await to(this.transactionService.create({user_id,transaction_type:TypeTransaction.CIUDAD, search_location:city}))

    if (errorTransaction) {
      throw new InternalServerErrorException(errorTransaction);
    }
 
    if (response.data && response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      console.log('Coordinates:', location.lat, location.lng);
      return `${location.lat},${location.lng}`;
    } else {
      console.log('No se encontrarón coordenadas para la ciudad proporcionada.');
    }

  }

}
