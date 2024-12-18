import { CustomValidationError } from "../../../error/CustomValidationError";
import GrantDto from "../dto/GrantDto";
import ServiceInterface from "../interface/ServiceInterface";
import Grant from "../model/Grant";

import { DeleteResult, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { profileService } from "./ProfileService";
import { sectorService } from "../../Api/service/SectorService";
import Profile from "../model/Profile";
import Sector from "../../Api/model/Sector";

/**
 * Service class for managing `Grant` entities.
 */
export class GrantService implements ServiceInterface<Grant, GrantDto> {
  private grantRepository: Repository<Grant>;

  /**
   * Initializes a new instance of the `GrantService` class.
   *
   * @param repository - The TypeORM repository for `Grant` entities.
   */
  constructor(repository: Repository<Grant>) {
    this.grantRepository = repository;
  }

  /**
   * Saves a new `Grant` entity to the database.
   *
   * @param grantDto - The data transfer object containing the `Grant` details.
   *
   * @returns The saved `Grant` entity.
   */
  async save(grantDto: Partial<GrantDto>): Promise<Grant> {
    const newGrant: Grant = grantDto.toGrant();

    return this.grantRepository.save(newGrant);
  }

  /**
   * Finds a `Grant` entity by partial matching of its properties.
   *
   * @param object - Partial `Grant` object containing properties to match.
   *
   * @returns The matched `Grant` entity or null if not found.
   */
  async findOne(object: Partial<Grant>): Promise<Grant | null> {
    const { route } = object;
    return await this.grantRepository.findOne({
      where: { route },
    });
  }

  /**
   * Finds a `Grant` entity by its ID.
   *
   * @param id - The ID of the `Grant` entity to find.
   *
   * @returns The `Grant` entity with the specified ID or null if not found.
   */
  async findOneById(id: string): Promise<Grant | null> {
    return await this.grantRepository.findOne({
      where: { id: id },
    });
  }

  /**
   * Retrieves all `Grant` entities from the database.
   *
   * @returns An array of all `Grant` entities or null if none found.
   */
  async findAll(): Promise<Grant[] | null> {
    return await this.grantRepository.find();
  }

  async findAllByAssociatedProfile(profileId: string): Promise<Grant[] | null> {
    const grants = await this.grantRepository
      .createQueryBuilder('grant')
      .innerJoin('grant.associatedProfiles', 'profile')
      .where('profile.id = :profileId', { profileId })
      .getMany();

    return grants;}

    async findAllByAssociatedSector(sectorId: string): Promise<Grant[] | null> {
      const grants = await this.grantRepository
        .createQueryBuilder('grant')
        .innerJoin('grant.associatedSectors', 'sector')
        .where('sector.id = :sectorId', { sectorId })
        .getMany();
  
      return grants;}
  

  /**
   * Updates an existing `Grant` entity.
   *
   * @param id - The ID of the `Grant` entity to update.
   * @param object - Partial `Grant` object containing updated properties.
   *
   * @returns The updated `Grant` entity.
   */
  async update(id: string, object: Partial<Grant>): Promise<Grant> {
    return this.grantRepository.save({
      ...object,
      id: id,
    });
  }

  /**
   * Deletes a `Grant` entity by its ID.
   *
   * @param name - The ID of the `Grant` entity to delete.
   *
   * @returns The result of the delete operation.
   *
   * @throws CustomValidationError if no `Grant` with the specified ID is found.
   */
  async delete(id: string): Promise<DeleteResult> {
    const grantToDelete: Grant = await this.grantRepository.findOneBy({ id });

    if (!grantToDelete) {
      throw new CustomValidationError(`Grant with ID ${id} not found`);
    }

    return await this.grantRepository.delete({ id });
  }

  async addProfileToGrant(grantId: string, profileId: string): Promise<Grant> {
    const grant: Grant = await this.grantRepository.findOne({ where: { id: grantId },});
    const profile: Profile = await profileService.findOneById(profileId);
    
    grant.associatedProfiles.push(profile);
    return await this.grantRepository.save(grant);
  }

  async addSectorToGrant(grantId: string, sectorId: string): Promise<Grant> {
    const grant: Grant = await this.grantRepository.findOne({ where: { id: grantId },});
    const sector: Sector = await sectorService.findOneById(sectorId);
    
    grant.associatedSectors.push(sector);
    return await this.grantRepository.save(grant);
  }
}

// Initialize the GrantService with the TypeORM repository and export it.
export const grantService = new GrantService(AppDataSource.getRepository(Grant));
