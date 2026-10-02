import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

const characters = [
  { name: "Maya", type: "Community", style: "maya" },
  { name: "Aisha", type: "Seller", style: "eli" },
  { name: "Eli", type: "Community", style: "noor" },
  { name: "Rohan", type: "Buyer", style: "bot-nova" },
  { name: "Noor", type: "Community", style: "bot-loop" },
];

type SceneItem = { icon: string; label: string };
type ScenePreset = {
  motion: "orbit" | "handoff" | "growth" | "wave" | "drift";
  kicker: string;
  message: string;
  items: [SceneItem, SceneItem, SceneItem];
};

const scenePresets: Record<string, ScenePreset> = {
  midnight: {
    motion: "orbit",
    kicker: "AFTER-HOURS FINDS",
    message: "Find your next favorite",
    items: [
      { icon: "📷", label: "FILM CAMERA" },
      { icon: "🎧", label: "STUDIO AUDIO" },
      { icon: "👟", label: "SNEAKERS" },
    ],
  },
  sunset: {
    motion: "handoff",
    kicker: "GOLDEN HOUR SWAPS",
    message: "Pass a good thing on",
    items: [
      { icon: "🎸", label: "VINYL" },
      { icon: "🧢", label: "STREETWEAR" },
      { icon: "📷", label: "INSTANT CAMERA" },
    ],
  },
  forest: {
    motion: "growth",
    kicker: "GOOD THINGS GROW",
    message: "Give useful things new roots",
    items: [
      { icon: "🪴", label: "HOUSEPLANT" },
      { icon: "🎒", label: "DAYPACK" },
      { icon: "📚", label: "FIELD GUIDE" },
    ],
  },
  violet: {
    motion: "orbit",
    kicker: "A LITTLE MORE CREATIVE",
    message: "Make room for inspiration",
    items: [
      { icon: "🎨", label: "ART PRINT" },
      { icon: "📚", label: "ART BOOKS" },
      { icon: "🎧", label: "HEADPHONES" },
    ],
  },
  ocean: {
    motion: "wave",
    kicker: "RIDE THE NEXT WAVE",
    message: "Good gear keeps moving",
    items: [
      { icon: "🏄", label: "BOARD" },
      { icon: "🎧", label: "TRAVEL AUDIO" },
      { icon: "🎒", label: "TRAIL PACK" },
    ],
  },
  mint: {
    motion: "growth",
    kicker: "FRESH STARTS, LESS WASTE",
    message: "Trade well. Leave more behind.",
    items: [
      { icon: "🪴", label: "PLANTER" },
      { icon: "🧺", label: "MARKET BASKET" },
      { icon: "👟", label: "TRAINERS" },
    ],
  },
  sky: {
    motion: "drift",
    kicker: "ROOM FOR WHAT'S NEXT",
    message: "Let good things find their way",
    items: [
      { icon: "📷", label: "CAMERA" },
      { icon: "🛹", label: "SKATEBOARD" },
      { icon: "🎒", label: "DAYPACK" },
    ],
  },
  peach: {
    motion: "handoff",
    kicker: "A BRIGHTER KIND OF TRADE",
    message: "Your next find is out there",
    items: [
      { icon: "👟", label: "SNEAKERS" },
      { icon: "🧢", label: "CAP" },
      { icon: "📷", label: "FILM CAMERA" },
    ],
  },
  rose: {
    motion: "orbit",
    kicker: "KEPT WITH CARE, SHARED WITH JOY",
    message: "A new story starts here",
    items: [
      { icon: "💐", label: "VASE" },
      { icon: "📚", label: "FAVORITE NOVEL" },
      { icon: "👜", label: "TOTE BAG" },
    ],
  },
  cloud: {
    motion: "drift",
    kicker: "A CLEARER WAY TO FIND",
    message: "Make space. Find something useful.",
    items: [
      { icon: "☕", label: "KETTLE" },
      { icon: "🪴", label: "HOUSEPLANT" },
      { icon: "🧺", label: "STORAGE BASKET" },
    ],
  },
  cream: {
    motion: "handoff",
    kicker: "THE GOOD THINGS, PASSED ON",
    message: "A little more life in every find",
    items: [
      { icon: "💡", label: "TABLE LAMP" },
      { icon: "📚", label: "BOOKS" },
      { icon: "🧺", label: "WOVEN BASKET" },
    ],
  },
  slate: {
    motion: "wave",
    kicker: "BUILT TO KEEP MOVING",
    message: "Useful things deserve another round",
    items: [
      { icon: "🎧", label: "HEADPHONES" },
      { icon: "⌚", label: "WATCH" },
      { icon: "📷", label: "CAMERA" },
    ],
  },
};

const itemPositions = ["camera", "headphones", "sneakers"] as const;

type DragSession = {
  character: string;
  pointerId: number;
  startX: number;
  startY: number;
  originOffset: { x: number; y: number };
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function getMovementBounds(
  sceneBounds: DOMRect,
  characterBounds: DOMRect,
  currentOffset: { x: number; y: number },
) {
  const safeMargin = 28;
  const baseLeft = characterBounds.left - currentOffset.x;
  const baseTop = characterBounds.top - currentOffset.y;

  return {
    minX: sceneBounds.left + safeMargin - baseLeft,
    maxX: sceneBounds.right - safeMargin - (baseLeft + characterBounds.width),
    minY: sceneBounds.top + safeMargin - baseTop,
    maxY: sceneBounds.bottom - safeMargin - (baseTop + characterBounds.height),
  };
}

function clampPosition(value: number, minimum: number, maximum: number) {
  if (maximum < minimum) return (minimum + maximum) / 2;
  return Math.max(minimum, Math.min(maximum, value));
}

export default function SwapScene({ theme }: { theme: string }) {
  const scene = scenePresets[theme] ?? scenePresets.midnight;
  const sceneRef = useRef<HTMLDivElement>(null);
  const dragSession = useRef<DragSession | null>(null);
  const [draggingCharacter, setDraggingCharacter] = useState<string | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<string, { x: number; y: number }>>({});

  const startDragging = (
    event: PointerEvent<HTMLDivElement>,
    character: string,
  ) => {
    const sceneBounds = sceneRef.current?.getBoundingClientRect();
    if (!sceneBounds) return;
    const currentOffset = dragOffsets[character] ?? { x: 0, y: 0 };
    const characterBounds = event.currentTarget.getBoundingClientRect();
    const limits = getMovementBounds(sceneBounds, characterBounds, currentOffset);

    dragSession.current = {
      character,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originOffset: currentOffset,
      ...limits,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingCharacter(character);
  };

  const drag = (event: PointerEvent<HTMLDivElement>, character: string) => {
    const session = dragSession.current;
    if (!session || session.character !== character || session.pointerId !== event.pointerId) return;

    const x = clampPosition(
      session.originOffset.x + event.clientX - session.startX,
      session.minX,
      session.maxX,
    );
    const y = clampPosition(
      session.originOffset.y + event.clientY - session.startY,
      session.minY,
      session.maxY,
    );
    setDragOffsets((current) => ({ ...current, [character]: { x, y } }));
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragSession.current = null;
    setDraggingCharacter(null);
  };

  const moveWithKeyboard = (
    event: KeyboardEvent<HTMLDivElement>,
    character: string,
  ) => {
    const directions: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -10, y: 0 },
      ArrowRight: { x: 10, y: 0 },
      ArrowUp: { x: 0, y: -10 },
      ArrowDown: { x: 0, y: 10 },
    };
    const direction = directions[event.key];
    if (!direction) return;

    event.preventDefault();
    const sceneBounds = sceneRef.current?.getBoundingClientRect();
    const characterBounds = event.currentTarget.getBoundingClientRect();
    if (!sceneBounds) return;

    setDragOffsets((current) => {
      const offset = current[character] ?? { x: 0, y: 0 };
      const { minX, maxX, minY, maxY } = getMovementBounds(
        sceneBounds,
        characterBounds,
        offset,
      );
      return {
        ...current,
        [character]: {
          x: clampPosition(offset.x + direction.x, minX, maxX),
          y: clampPosition(offset.y + direction.y, minY, maxY),
        },
      };
    });
  };

  return (
    <div
      ref={sceneRef}
      className="swap-scene dashboard-swap-scene"
      data-motion={scene.motion}
      data-scene-theme={theme}
      role="group"
      aria-label={`Animated ${scene.kicker.toLowerCase()} scene. Move people by dragging them or focusing one and using the arrow keys.`}
    >
      <p className="swap-scene-kicker">{scene.kicker}</p>
      <div className="swap-scene-floor" aria-hidden="true" />
      <div className="swap-scene-sparkles" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>
      <div className="swap-scene-orbit" aria-hidden="true" />
      <div className="swap-scene-center" aria-hidden="true">
        <span>↔</span>
        <strong>FAIR MATCH</strong>
        <small>{scene.message}</small>
      </div>
      {characters.map((character) => (
        <div
          className={`swap-character swap-character-${character.style}${draggingCharacter === character.style ? " is-dragging" : ""}`}
          key={character.name}
          role="group"
          aria-label={`${character.name}, ${character.type}. Drag or use arrow keys to move.`}
          aria-roledescription="movable character"
          tabIndex={0}
          style={
            dragOffsets[character.style]
              ? ({
                  transform: `translate(${dragOffsets[character.style].x}px, ${dragOffsets[character.style].y}px)`,
                } as CSSProperties)
              : undefined
          }
          onPointerDown={(event) => startDragging(event, character.style)}
          onPointerMove={(event) => drag(event, character.style)}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={(event) => moveWithKeyboard(event, character.style)}
        >
          <div className="swap-character-art">
            <div className="swap-avatar swap-avatar-human">
              <span className="swap-human-hair" />
              <span className="swap-human-face"><i /><i /></span>
              <span className="swap-human-body" />
              <span className="swap-human-legs" />
            </div>
          </div>
          <strong>{character.name}</strong>
          <small>{character.type}</small>
        </div>
      ))}
      {scene.items.map((item, index) => (
        <div
          className={`swap-item swap-item-${itemPositions[index]}`}
          key={`${theme}-${item.label}`}
          aria-hidden="true"
        >
          <span>{item.icon}</span><small>{item.label}</small>
        </div>
      ))}
      <span className="swap-scene-caption" aria-hidden="true">Pass it on. Find your next.</span>
    </div>
  );
}