import User from "../../Auth/model/User";
import UserGroup from "../../Auth/model/UserGroup";
import Message from "../model/Message";

/**
 * Data Transfer Object (DTO) for the `Message` entity.
 * This class is used to transfer data between different layers of the application
 * and to interact with the `Message` entity.
 */
export default class MessageDto {
  /**
   * The unique identifier for the message.
   * This field is optional and may not be set initially.
   *
   * @type {string | undefined}
   * @private
   */
  private id?: string;

  /**
   * The text content of the message.
   *
   * @type {string}
   * @private
   */
  private text: string;

  /**
   * The user who sent the message.
   *
   * @type {User}
   * @private
   */
  private sender: User;

  /**
   * The user who receives the message.
   *
   * @type {User}
   * @private
   */
  private receiver?: User;

  /**
   * The user group that receives the message.
   *
   * @type {UserGroup}
   * @private
   */
  private receiverGroup?: UserGroup;

  /**
   * Creates an instance of the MessageDto class.
   *
   * @param {string} text - The text content of the message.
   * @param {User} sender - The user who sends the message.
   * @param {User} receiver - The user who receives the message.
   * @param {UserGroup} receiverGroup - The user group that receives the message.
   * @param {Date} sendedAt - The timestamp when the message was sent.
   */
  constructor(
    text: string,
    sender: User,
    receiver: User,
    receiverGroup: UserGroup
  ) {
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.receiverGroup = receiverGroup;
  }

  /**
   * Gets the ID of the message.
   *
   * @returns {string | undefined} The ID of the message, or `undefined` if not set.
   */
  public getId(): string | undefined {
    return this.id;
  }

  /**
   * Sets the ID of the message.
   *
   * @param {string} id - The ID of the message.
   */
  public setId(id: string): void {
    this.id = id;
  }

  /**
   * Gets the text content of the message.
   *
   * @returns {string} The text content of the message.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Sets the text content of the message.
   *
   * @param {string} text - The new text content to set for the message.
   */
  public setText(text: string): void {
    this.text = text;
  }

  /**
   * Gets the sender of the message.
   *
   * @returns {User} The user who sent the message.
   */
  public getSender(): User {
    return this.sender;
  }

  /**
   * Sets the sender of the message.
   *
   * @param {User} sender - The user to set as the sender of the message.
   */
  public setSender(sender: User): void {
    this.sender = sender;
  }

  /**
   * Gets the receiver of the message.
   *
   * @returns {User} The user who receives the message.
   */
  public getReceiver(): User {
    return this.receiver;
  }

  /**
   * Sets the receiver of the message.
   *
   * @param {User} receiver - The user to set as the receiver of the message.
   */
  public setReceiver(receiver: User): void {
    this.receiver = receiver;
  }

  /**
   * Gets the receiver group of the message.
   *
   * @returns {UserGroup} The user group that receives the message.
   */
  public getReceiverGroup(): UserGroup {
    return this.receiverGroup;
  }

  /**
   * Sets the receiver group of the message.
   *
   * @param {UserGroup} receiverGroup - The user group to set as the receiver group.
   */
  public setReceiverGroup(receiverGroup: UserGroup): void {
    this.receiverGroup = receiverGroup;
  }

  /**
   * Checks if the `MessageDto` instance is valid.
   * The `text`, `sender`, `receiver`, and `sendedAt` properties must be non-null and properly set.
   *
   * @returns {boolean} `true` if the `MessageDto` is valid, otherwise `false`.
   */
  public isValid(): boolean {
    return (
      this.text !== null &&
      this.text.trim() !== "" &&
      this.sender !== null &&
      (this.receiver !== null || this.receiverGroup !== null)
    );
  }

  /**
   * Converts the `MessageDto` to a `Message` entity.
   * Creates a new `Message` entity using the properties of this DTO.
   *
   * @returns {Message} The `Message` entity created from this DTO.
   */
  public toMessage(): Message {
    const message = new Message(
      this.text,
      this.sender,
      this.receiver ?? null,
      this.receiverGroup ?? null,
      new Date()
    );
    return message;
  }
}