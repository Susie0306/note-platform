'use client';

import { BasicBlocksKit } from '@/kits/basic-blocks-kit';
import { BasicMarksKit } from '@/kits/basic-marks-kit';

export const BasicNodesKit = [...BasicBlocksKit, ...BasicMarksKit];
