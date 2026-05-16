import * as React from 'react';
import { MoreHorizontal, Move } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import {
  SidebarDragPuck,
  SidebarSection,
  SidebarSliderRow,
  SidebarSliderTrack,
  SidebarTabContent,
  SidebarViewPresetButton,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';

function GridOverlay({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.05]"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="border-[0.5px] border-foreground" />
      ))}
    </div>
  );
}

export function CameraTab({
  onSetRotation,
  onResetView,
  onPanView,
  onZoomChange,
  zoomValue,
}: {
  onSetRotation: (phi: number, theta: number) => void;
  onResetView: () => void;
  onPanView: (dx: number, dy: number) => void;
  onZoomChange: (value: number) => void;
  zoomValue: number;
}) {
  const [puckPos, setPuckPos] = React.useState({ x: 0, y: 0 });
  const [isDraggingPuck, setIsDraggingPuck] = React.useState(false);
  const [panPuckPos, setPanPuckPos] = React.useState({ x: 0, y: 0 });
  const [isDraggingPanPuck, setIsDraggingPanPuck] = React.useState(false);

  const startOrbitDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingPuck(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMove = (ev: MouseEvent) => {
      const relX = ev.clientX - centerX;
      const relY = ev.clientY - centerY;
      const scale = 0.01;
      onSetRotation(relX * scale, relY * scale);
      const limitX = rect.width / 2 - 24;
      const limitY = rect.height / 2 - 24;
      setPuckPos({
        x: Math.max(-limitX, Math.min(limitX, relX)),
        y: Math.max(-limitY, Math.min(limitY, relY)),
      });
    };
    const onUp = () => {
      setIsDraggingPuck(false);
      setPuckPos({ x: 0, y: 0 });
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    document.body.style.cursor = 'grabbing';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const startPanDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingPanPuck(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMove = (ev: MouseEvent) => {
      const scale = 5;
      onPanView(ev.movementX * scale, -ev.movementY * scale);
      const relX = ev.clientX - centerX;
      const relY = ev.clientY - centerY;
      const limitX = rect.width / 2 - 16;
      const limitY = rect.height / 2 - 16;
      setPanPuckPos({
        x: Math.max(-limitX, Math.min(limitX, relX)),
        y: Math.max(-limitY, Math.min(limitY, relY)),
      });
    };
    const onUp = () => {
      setIsDraggingPanPuck(false);
      setPanPuckPos({ x: 0, y: 0 });
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    document.body.style.cursor = 'grabbing';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const orbitOverlay = (
    <>
      <GridOverlay cols={12} rows={6} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-wn-divider" />
        <div className="h-full w-[1px] bg-wn-divider" />
        <div className="absolute w-full h-[1px] bg-wn-divider/25 rotate-[31deg]" />
        <div className="absolute w-full h-[1px] bg-wn-divider/25 -rotate-[31deg]" />
      </div>
    </>
  );

  const panOverlay = (
    <>
      <GridOverlay cols={8} rows={3} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-wn-divider" />
        <div className="h-full w-[1px] bg-wn-divider" />
      </div>
    </>
  );

  const { t } = useT();

  return (
    <SidebarTabContent>
      <SidebarSection title={t('sidebar.tab.camera.section.rotation')}>
        <div className="flex flex-col items-center gap-2">
          <SidebarDragPuck
            aspect="square"
            isDragging={isDraggingPuck}
            onMouseDown={startOrbitDrag}
            overlay={orbitOverlay}
          >
            <div className="absolute inset-0 p-4 flex flex-col justify-between items-center pointer-events-none">
              <SidebarViewPresetButton
                variant="axis"
                label="Y"
                title={t('sidebar.tab.camera.view.top')}
                onClick={() => onSetRotation(0, 0)}
              />
              <div className="flex justify-between w-full items-center">
                <SidebarViewPresetButton
                  variant="axis"
                  label="-X"
                  title={t('sidebar.tab.camera.view.left')}
                  onClick={() => onSetRotation(-Math.PI / 2, Math.PI / 2)}
                />

                <div
                  className={cn(
                    'size-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground z-10',
                    !isDraggingPuck && 'transition-transform duration-300 ease-out',
                  )}
                  style={{ transform: `translate(${puckPos.x}px, ${puckPos.y}px)` }}
                >
                  <MoreHorizontal size={14} className="rotate-90" />
                </div>

                <SidebarViewPresetButton
                  variant="axis"
                  label="X"
                  title={t('sidebar.tab.camera.view.right')}
                  onClick={() => onSetRotation(Math.PI / 2, Math.PI / 2)}
                />
              </div>
              <SidebarViewPresetButton
                variant="axis"
                label="-Y"
                title={t('sidebar.tab.camera.view.bottom')}
                onClick={() => onSetRotation(Math.PI, 0)}
              />
            </div>

            <SidebarViewPresetButton
              variant="iso"
              title={t('sidebar.tab.camera.view.iso1')}
              className="absolute top-2 left-2"
              onClick={() => onSetRotation(Math.PI / 4, Math.PI / 4)}
            />
            <SidebarViewPresetButton
              variant="iso"
              title={t('sidebar.tab.camera.view.iso2')}
              className="absolute top-2 right-2"
              onClick={() => onSetRotation(-Math.PI / 4, Math.PI / 4)}
            />
            <SidebarViewPresetButton
              variant="iso"
              title={t('sidebar.tab.camera.view.iso3')}
              className="absolute bottom-2 left-2"
              onClick={() => onSetRotation((3 * Math.PI) / 4, Math.PI / 4)}
            />
            <SidebarViewPresetButton
              variant="iso"
              title={t('sidebar.tab.camera.view.iso4')}
              className="absolute bottom-2 right-2"
              onClick={() => onSetRotation((-3 * Math.PI) / 4, Math.PI / 4)}
            />
          </SidebarDragPuck>

          <div className="flex justify-between w-full px-1">
            <span className="text-[10px] text-muted-foreground italic">
              {t('sidebar.tab.camera.hint.orbit')}
            </span>
            <button
              onClick={() => onResetView()}
              className="text-[10px] text-muted-foreground hover:text-foreground font-medium underline-offset-2 hover:underline"
            >
              {t('sidebar.tab.camera.reset')}
            </button>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title={t('sidebar.tab.camera.section.pan')}>
        <div className="flex flex-col items-center gap-2">
          <SidebarDragPuck
            aspect="wide"
            isDragging={isDraggingPanPuck}
            onMouseDown={startPanDrag}
            onDoubleClick={() => {
              onResetView();
              setPanPuckPos({ x: 0, y: 0 });
            }}
            overlay={panOverlay}
          >
            <div
              className={cn(
                'size-8 rounded-lg bg-card border shadow-sm flex items-center justify-center z-10 transition-colors',
                isDraggingPanPuck
                  ? 'border-wn-accent text-wn-accent shadow-md'
                  : 'border-border text-muted-foreground group-hover:border-muted-foreground',
                !isDraggingPanPuck && 'transition-transform duration-300 ease-out',
              )}
              style={{ transform: `translate(${panPuckPos.x}px, ${panPuckPos.y}px)` }}
            >
              <Move size={14} />
            </div>
          </SidebarDragPuck>
          <span className="text-[9px] text-muted-foreground italic">{t('sidebar.tab.camera.hint.pan')}</span>
        </div>
      </SidebarSection>

      <SidebarSection title={t('sidebar.tab.camera.section.zoom')}>
        <SidebarSliderRow
          value={zoomValue}
          onCommit={(val) => onZoomChange(val)}
          min={0}
          max={100}
          format={(v) => `${Math.round(v)}%`}
          description={t('sidebar.tab.camera.hint.zoom')}
          slider={
            <SidebarSliderTrack
              value={[zoomValue]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => onZoomChange(val)}
            />
          }
        />
      </SidebarSection>

      <SidebarSection>
        <Button
          variant="outline"
          className="w-full h-8 text-[11px] bg-card border-border"
          onClick={() => {
            onResetView();
            setPanPuckPos({ x: 0, y: 0 });
            onZoomChange(50);
          }}
        >
          {t('sidebar.tab.camera.resetCamera')}
        </Button>
      </SidebarSection>
    </SidebarTabContent>
  );
}
