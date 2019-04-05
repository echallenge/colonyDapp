/* @flow */

import type { FormikProps } from 'formik';

import { ContentState, EditorState } from 'draft-js';

// $FlowFixMe
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { MultiLineEdit, ActionForm } from '~core/Fields';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyENSName: *, draftId: *, description: * }>,
|};

const TaskDescription = ({
  description,
  isTaskCreator,
  colonyENSName,
  draftId,
}: Props) => (
  <ActionForm
    initialValues={{
      description: EditorState.createWithContent(
        ContentState.createFromText(description || ''),
      ),
    }}
    submit={ACTIONS.TASK_SET_DESCRIPTION}
    success={ACTIONS.TASK_SET_DESCRIPTION_SUCCESS}
    error={ACTIONS.TASK_SET_DESCRIPTION_ERROR}
    transform={(originalAction: *) => ({
      ...originalAction,
      payload: {
        ...originalAction.payload,
        description: originalAction.payload.description
          .getCurrentContent()
          .getPlainText(),
        colonyENSName,
        draftId,
      },
    })}
  >
    {({ submitForm }: FormikProps<*>) => {
      const onBlur = useCallback(() => submitForm());
      return (
        <MultiLineEdit
          name="description"
          placeholder={MSG.placeholder}
          readOnly={!isTaskCreator}
          onEditorBlur={onBlur}
        />
      );
    }}
  </ActionForm>
);

export default TaskDescription;
