import User from "../../Auth/model/User";
import Sector from "../model/Sector";
import Project from "../model/Project"; // Assuming Project is the entity for the project

/**
 * Data Transfer Object (DTO) for Project entities.
 * This class is used to encapsulate data when transferring information about projects between layers of the application.
 */
export default class ProjectDto {

  /**
   * @private
   * Private name of the project. 
   */
  private _name: string;

  /**
   * @private
   * Private list of sectors associated with the project.
   */
  private _sectors?: Sector[];

  /**
   * @private
   * Private list of coordinators associated with the project.
   */
  private _coordinators?: User[];

  /**
   * @private
   * Private list of members associated with the project.
   */
  private _members?: User[];

  /**
   * Constructor for creating an instance of `ProjectDto`.
   *
   * @param {string} name - The name of the project.
   * @param {Sector[]} [sectors] - Optional array of sectors associated with the project.
   * @param {User[]} [coordinators] - Optional array of coordinators for the project.
   */
  constructor(
    name: string,
    sectors?: Sector[],
    coordinators?: User[],
    members?: User[],
  ) {
    this._name = name;
    this._sectors = sectors;
    this._coordinators = coordinators;
    this._members = members;
  }

  /**
   * Converts the `ProjectDto` instance into a `Project` entity.
   * This method transforms the DTO into an entity that can be persisted in the database.
   *
   * @returns {Project} The corresponding `Project` entity.
   */
  public toProject(): Project {
    const now: Date = new Date();
    const project = new Project(this.name, now, now);
    return project;
  }

  /**
   * Getter for the name of the project.
   *
   * @returns {string} The name of the project.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Setter for the name of the project.
   *
   * @param {string} value The new name of the project.
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Getter for the list of sectors related to the project.
   *
   * @returns {Sector[] | undefined} The list of sectors or undefined if not set.
   */
  public get sectors(): Sector[] | undefined {
    return this._sectors;
  }

  /**
   * Setter for the list of sectors related to the project.
   *
   * @param {Sector[]} value The new list of sectors.
   */
  public set sectors(value: Sector[] | undefined) {
    this._sectors = value;
  }

  /**
   * Getter for the list of coordinators associated with the project.
   *
   * @returns {User[] | undefined} The list of coordinators or undefined if not set.
   */
  public get coordinators(): User[] | undefined {
    return this._coordinators;
  }

  /**
   * Setter for the list of coordinators associated with the project.
   *
   * @param {User[]} value The new list of coordinators.
   */
  public set coordinators(value: User[] | undefined) {
    this._coordinators = value;
  }

  /**
   * Validates if the current `ProjectDto` instance has the required fields set.
   * 
   * @returns {boolean} True if the instance is valid, false otherwise.
   */
  public isValid(): boolean {
    return this._name != null;
  }
}
