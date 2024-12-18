import ProfileDto from "../dto/ProfileDto";
import ServiceInterface from "../interface/ServiceInterface";
import Profile from "../model/Profile";

import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { NotFoundError } from "../../../error/NotFoundError";
import User from "../model/User";
import Grant from "../model/Grant";

/**
 * Service class for managing `Profile` entities.
 */
export class ProfileService implements ServiceInterface<Profile, ProfileDto> {
  private profileRepository: Repository<Profile>;

  /**
   * Initializes a new instance of the `ProfileService` class.
   *
   * @param profileRepository - The repository instance to handle `Profile` data operations.
   */
  constructor(profileRepository: Repository<Profile>) {
    this.profileRepository = profileRepository;
  }

  /**
   * Saves a new `Profile` or updates an existing one.
   *
   * @param profileDto - The DTO containing profile data to be saved or updated.
   * @returns The saved or updated `Profile` entity.
   */
  async save(profileDto: ProfileDto): Promise<Profile> {
    if (profileDto.isValid()) {
      const newProfile: Profile = profileDto.toProfile();
      return await this.profileRepository.save(newProfile);
    } else {
      throw new InvalidObjectError(
        'All fields of the new profile must be non-null or different of "" .'
      );
    }
  }

  /**
   * Finds a `Profile` by given criteria.
   *
   * @param object - Partial criteria to search for a `Profile`.
   * @returns The `Profile` entity matching the criteria, or `null` if not found.
   */
  async findOne(conditions: Partial<Profile>): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: conditions as FindOptionsWhere<Profile>,
    });
  }

  /**
   * Finds a `Profile` by its ID.
   *
   * @param id - The unique identifier of the `Profile`.
   * @returns The `Profile` entity with the given ID, or `null` if not found.
   */
  async findOneById(id: string): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: { id },
    });
  }

  /**
   * Retrieves all `Profile` entities.
   *
   * @returns An array of all `Profile` entities, or an empty array if none found.
   */
  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  /**
   * Updates an existing `Profile`.
   *
   * @param id - The unique identifier of the `Profile` to update.
   * @param object - Partial data to update the `Profile` with.
   * @returns The updated `Profile` entity.
   */
  async update(id: string, object: Partial<Profile>): Promise<Profile> {
    const profileToUpdate = await this.profileRepository.findOneBy({ id });

    if (!profileToUpdate) {
      throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return await this.profileRepository.save({
      ...object,
      id: id,
    });
  }

  /**
   * Deletes a `Profile` by its ID.
   *
   * @param id - The unique identifier of the `Profile` to delete.
   * @returns The result of the delete operation.
   * @throws `CustomValidationError` if the `Profile` is not found.
   */
  async delete(id: string): Promise<DeleteResult> {
    const profileToDelete = await this.profileRepository.findOneBy({ id });

    if (!profileToDelete) {
      throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return await this.profileRepository.delete({ id });
  }

  async addUserToProfile(user: User, profile: Profile): Promise<Profile> {
    profile.users.push(user);
    return this.profileRepository.save(profile);
  }
  
  async removeUser(userId: string, profileId: string): Promise<Profile> {
    const profile: Profile = await profileRepository.findOne({
      where: { id: profileId },
      relations: ["users"],
    });

    if (!profile) {
      throw new NotFoundError(`Profile with ID ${profileId} not found.`);
    }

    profile.users = profile.users.filter(
      (user) => user.id !== userId
    );

    return profileRepository.save(profile);
  }

  async addGrantToProfile(grant: Grant, profile: Profile): Promise<Profile> {
    profile.associatedGrants.push(grant);
    return this.profileRepository.save(profile);
  }

  async removeGrant(grantId: string, profileId: string): Promise<Profile> {
    const profile: Profile = await profileRepository.findOne({
      where: { id: profileId },
      relations: ["associatedGrants"],
    });

    if (!profile) {
      throw new NotFoundError(`Profile with ID ${profileId} not found.`);
    }

    profile.associatedGrants = profile.associatedGrants.filter(
      (grant) => grant.id !== grantId
    );

    return profileRepository.save(profile);
  }
}

// Initialize the repository and export the service instance
const profileRepository: Repository<Profile> =
  AppDataSource.getRepository(Profile);
export const profileService: ProfileService = new ProfileService(
  profileRepository
);
