import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapAreasFilterDto } from './dto/map-areas-filter.dto';
import { MapAreaResponseDto } from './dto/map-area-response.dto';
import { MapArea, MapAreaDocument } from './schemas/map-area.schema';

@Injectable()
export class MapAreasService {
  constructor(
    @InjectModel(MapArea.name) private mapAreaModel: Model<MapAreaDocument>,
  ) {}

  async getAreas(filters: MapAreasFilterDto): Promise<MapAreaResponseDto> {
    try {
      // Build MongoDB query based on filters
      const query: any = {};

      if (filters.layerType) {
        const typeLower = filters.layerType.toLowerCase();
        query['properties.layerType'] = { $regex: typeLower, $options: 'i' };
      }

      if (filters.area) {
        const areaLower = filters.area.toLowerCase();
        query.$or = [
          { 'properties.comune': { $regex: areaLower, $options: 'i' } },
          { 'properties.localita': { $regex: areaLower, $options: 'i' } },
          { 'properties.codice_rt': { $regex: areaLower, $options: 'i' } },
        ];
      }

      if (filters.intervention) {
        const interventionLower = filters.intervention.toLowerCase();
        query['properties.des_classe'] = {
          $regex: interventionLower,
          $options: 'i',
        };
      }

      if (filters.budget_min) {
        query['properties.budget_min'] = {
          $gte: Number(filters.budget_min) || 0,
        };
      }

      if (filters.budget_max) {
        query['properties.budget_max'] = {
          $lte: Number(filters.budget_max) || Number.MAX_VALUE,
        };
      }

      if (filters.priority) {
        const priorityLower = filters.priority.toLowerCase();
        query['properties.des_classe'] = {
          $regex: priorityLower,
          $options: 'i',
        };
      }

      // Get filtered areas from MongoDB
      const areas = await this.mapAreaModel
        .find(query)
        .select('_id type geometry properties')
        .lean()
        .exec();

      const transformedAreas =
        areas?.map((area) => ({
          ...area,
          _id: area._id?.toString(),
        })) || [];

      return {
        type: 'FeatureCollection',
        features: transformedAreas,
      };
    } catch (error) {
      throw new Error(`Failed to fetch map areas: ${error.message}`);
    }
  }
}
