/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { Formik } from 'formik';

import Heading from '~core/Heading';
import CopyableAddress from '~core/CopyableAddress';
import { FieldSet, Input, InputLabel, Textarea } from '~core/Fields';
import Button from '~core/Button';
import AvatarUploader from '~core/AvatarUploader';
import ColonyAvatar from '~core/ColonyAvatar';

import styles from './ProfileEdit.css';

import type { ColonyType } from '~types/colony';

const MSG = defineMessages({
  labelAddress: {
    id: 'admin.Profile.ProfileEdit.labelAddress',
    defaultMessage:
      'Colony address (send tokens to this address to fund your Colony)',
  },
  labelEnsName: {
    id: 'admin.Profile.ProfileEdit.labelEnsName',
    defaultMessage: 'Colony ENS',
  },
  labelDisplayName: {
    id: 'admin.Profile.ProfileEdit.labelDisplayName',
    defaultMessage: 'Colony Display Name',
  },
  labelAbout: {
    id: 'admin.Profile.ProfileEdit.labelAbout',
    defaultMessage: 'About',
  },
  labelWebsite: {
    id: 'admin.Profile.ProfileEdit.labelWebsite',
    defaultMessage: 'Website',
  },
  labelGuidelines: {
    id: 'admin.Profile.ProfileEdit.labelGuidelines',
    defaultMessage: 'Contribution Guidelines',
  },
  labelProfilePicture: {
    id: 'admin.Profile.ProfileEdit.labelProfilePicture',
    defaultMessage: 'Colony Profile Picture',
  },
  labelUploader: {
    id: 'admin.Profile.ProfileEdit.labelUploader',
    defaultMessage: 'at least 250px by 250px, up to 1MB',
  },
});

/*
 * This is due to `displayName` already being declared in the Component's scope
 */
const componentDisplayName: string = 'admin.Profile.ProfileEdit';

/*
 * @TODO Replace with ACTUAL upload & remove methods
 */
const placeholderUpload = async () => {
  const uploadMessage: string = `[${componentDisplayName}] Uploaded Image`;
  console.log(uploadMessage);
  return uploadMessage;
};
const placeholderRemove = async () => {
  console.log(`[${componentDisplayName}] Removed Image`);
  return undefined;
};

type Props = {
  colony: ColonyType,
};

const ProfileEdit = ({
  colony: {
    address,
    ensName,
    name: displayName,
    description,
    website,
    guideline,
    avatar,
  },
}: Props) => (
  <div className={styles.main}>
    <main className={styles.content}>
      <Formik
        onSubmit={console.log}
        initialValues={{
          colonyDisplayName: displayName,
          aboutColony: description,
          colonyWebsite: website,
          colonyGuidelines: guideline,
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FieldSet className={styles.section}>
              <InputLabel label={MSG.labelAddress} />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {address}
              </CopyableAddress>
            </FieldSet>
            <FieldSet className={styles.section}>
              <InputLabel label={MSG.labelEnsName} />
              <Heading
                appearance={{ margin: 'none', size: 'medium', weight: 'thin' }}
                /*
                 * I have no idea of the actual format of the ENS name,
                 * so I'm assuming we have to append the `colony.eth`
                 * domain name manually
                 */
                text={`${ensName.toLowerCase()}.colony.eth`}
              />
            </FieldSet>
            <div className={styles.divider} />
            <FieldSet className={styles.inputSection}>
              <Input
                appearance={{ theme: 'fat' }}
                label={MSG.labelDisplayName}
                name="colonyDisplayName"
                maxLength={50}
              />
            </FieldSet>
            <FieldSet className={styles.inputSection}>
              <Textarea
                appearance={{ theme: 'fat', resizable: 'vertical' }}
                style={{ minHeight: styles.textareaHeight }}
                label={MSG.labelAbout}
                name="aboutColony"
                maxLength={160}
              />
            </FieldSet>
            <FieldSet className={styles.inputSection}>
              <Input
                appearance={{ theme: 'fat' }}
                label={MSG.labelWebsite}
                name="colonyWebsite"
                maxLength={100}
              />
            </FieldSet>
            <FieldSet className={styles.inputSection}>
              <Input
                appearance={{ theme: 'fat' }}
                label={MSG.labelGuidelines}
                name="colonyGuidelines"
                maxLength={100}
              />
            </FieldSet>
            <FieldSet>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                style={{ width: styles.wideButton }}
                text={{ id: 'button.save' }}
                type="submit"
              />
            </FieldSet>
          </form>
        )}
      </Formik>
    </main>
    <aside className={styles.sidebar}>
      <AvatarUploader
        label={MSG.labelProfilePicture}
        help={MSG.labelUploader}
        placeholder={
          <ColonyAvatar
            /*
             * @NOTE Unlike other components this does not override the main class
             * But appends the current one to that
             */
            className={styles.avatar}
            avatarURL={avatar}
            size="xl"
            colonyAddress={address}
            colonyName={ensName}
          />
        }
        upload={placeholderUpload}
        remove={placeholderRemove}
      />
    </aside>
  </div>
);

ProfileEdit.displayName = componentDisplayName;

export default ProfileEdit;