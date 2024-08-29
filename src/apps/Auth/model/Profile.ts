import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import ProfileGrant from "./ProfileGrant";

@Entity("profiles")
class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  name: string;

  @Column({ type: "varchar", nullable: true, unique: true })
  description: string;

  @Column({ type: "boolean", default: false })
  isAdmin: boolean;

  @OneToMany(() => User, (user) => user.profile, { cascade: true })
  users: User[];

  @OneToMany(() => ProfileGrant, (profileGrant) => profileGrant.profile) // Define a relação com ProfileGrant
  profileGrants: ProfileGrant[];

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;
}

export default Profile;
