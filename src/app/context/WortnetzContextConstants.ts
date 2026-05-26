import { PhysicsKeyframe } from './WortnetzContextTypes';
import { type PhysicsParams } from '../graph';

export const EMPTY_PHYSICS_KFS = {
  'phys-rep': [] as PhysicsKeyframe[],
  'phys-spk': [] as PhysicsKeyframe[],
  'phys-dmp': [] as PhysicsKeyframe[],
  'phys-lnk': [] as PhysicsKeyframe[],
  'phys-grv': [] as PhysicsKeyframe[],
  'phys-trb': [] as PhysicsKeyframe[],
  'phys-vto': [] as PhysicsKeyframe[],
  'phys-pls': [] as PhysicsKeyframe[],
  'fx-blm': [] as PhysicsKeyframe[],
  'fx-blm-rad': [] as PhysicsKeyframe[],
  'fx-blm-thr': [] as PhysicsKeyframe[],
  'fx-blm-sel': [] as PhysicsKeyframe[],
  'fx-blm-flk-spd': [] as PhysicsKeyframe[],
  'fx-node-scale': [] as PhysicsKeyframe[],
  'fx-edge-opacity': [] as PhysicsKeyframe[],
  'fx-rad-bias': [] as PhysicsKeyframe[],
  'fx-glc-rad': [] as PhysicsKeyframe[],
  'fx-glc-fth': [] as PhysicsKeyframe[],
  'fx-pth-sm': [] as PhysicsKeyframe[],
  'fx-hue-shift': [] as PhysicsKeyframe[],
  'fx-vig-drk': [] as PhysicsKeyframe[],
  'fx-chr-off': [] as PhysicsKeyframe[],
  'fx-grn-int': [] as PhysicsKeyframe[],
  'fx-pxl-sz': [] as PhysicsKeyframe[],
};

export const PHYS_TRACK_PARAM: Record<string, keyof PhysicsParams> = {
  'phys-rep': 'repulsion',
  'phys-spk': 'springK',
  'phys-dmp': 'damping',
  'phys-lnk': 'linkDistance',
  'phys-grv': 'gravity',
  'phys-trb': 'turbulence',
  'phys-vto': 'verticalOrder',
};

/** All visual/effects track IDs (i.e. NOT physics tracks, NOT camera). */
export const VISUAL_TRACK_IDS = [
  'fx-blm',
  'fx-blm-rad',
  'fx-blm-thr',
  'fx-blm-sel',
  'fx-blm-flk-spd',
  'fx-node-scale',
  'fx-edge-opacity',
  'fx-rad-bias',
  'fx-glc-rad',
  'fx-glc-fth',
  'fx-pth-sm',
  'fx-hue-shift',
  'fx-vig-drk',
  'fx-chr-off',
  'fx-grn-int',
  'fx-pxl-sz',
] as const;

/** Mapping from visual track ID → the corresponding visualSettings / styleSettings key. */
export const VISUAL_TRACK_PARAM: Record<string, string> = {
  'fx-blm':         'bloomIntensity',
  'fx-blm-rad':     'bloomRadius',
  'fx-blm-thr':     'bloomThreshold',
  'fx-blm-sel':     'bloomSelectiveRatio',
  'fx-blm-flk-spd': 'bloomFlickerSpeed',
  'fx-node-scale':  'nodeScale',
  'fx-edge-opacity':'edgeOpacity',
  'fx-rad-bias':    'radialBiasScale',
  'fx-glc-rad':     'glitchBrushRadius',
  'fx-glc-fth':     'glitchFeather',
  'fx-pth-sm':      'pathSmoothness',
  'fx-hue-shift':   'gradientHueShift',
  'fx-vig-drk':     'vignetteDarkness',
  'fx-chr-off':     'chromaOffset',
  'fx-grn-int':     'grainIntensity',
  'fx-pxl-sz':      'pixelSize',
};
