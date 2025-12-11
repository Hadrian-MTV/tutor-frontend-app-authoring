import { useSelector } from 'react-redux';
import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Divider } from '../../../../generic/divider';
import { getCanEdit, getCourseUnitData } from '../../../data/selectors';
import { useClipboard } from '../../../../generic/clipboard';
import messages from '../../messages';
import PublishModal from '../../../../course-outline/publish-modal/PublishModal';
import { useCourseOutline } from '../../../../course-outline/hooks';
import { getCourseId } from '../../../data/selectors';

interface ActionButtonsProps {
  openDiscardModal: () => void,
  handlePublishing: (revokeCertificates: boolean) => void,
}

const ActionButtons = ({
  openDiscardModal,
  handlePublishing,
}: ActionButtonsProps) => {
  const intl = useIntl();
  const {
    id,
    published,
    hasChanges,
    enableCopyPasteUnits,
  } = useSelector(getCourseUnitData);
  const canEdit = useSelector(getCanEdit);
  const { copyToClipboard } = useClipboard();
  const courseId = useSelector(getCourseId);
  const { isPublishModalOpen, closePublishModal, openPublishModal } = useCourseOutline({ courseId });
  const onClickPublish = (revokeCertificates) => {
    handlePublishing(revokeCertificates);
    closePublishModal();
  }

  return (
    <>
      {(!published || hasChanges) && (
        <Button
          size="sm"
          className="mt-3.5"
          variant="outline-primary"
          onClick={openPublishModal}
        >
          {intl.formatMessage(messages.actionButtonPublishTitle)}
        </Button>
      )}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={closePublishModal}
        onPublishSubmit={onClickPublish}
      />
      {(published && hasChanges) && (
        <Button
          size="sm"
          variant="link"
          onClick={openDiscardModal}
          className="course-unit-sidebar-footer__discard-changes__btn mt-2"
        >
          {intl.formatMessage(messages.actionButtonDiscardChangesTitle)}
        </Button>
      )}
      {enableCopyPasteUnits && canEdit && (
        <>
          <Divider className="course-unit-sidebar-footer__divider" />
          <Button
            onClick={() => copyToClipboard(id)}
            variant="outline-primary"
            size="sm"
          >
            {intl.formatMessage(messages.actionButtonCopyUnitTitle)}
          </Button>
        </>
      )}
    </>
  );
};

export default ActionButtons;
