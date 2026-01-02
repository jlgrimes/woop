'use client';

import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';

export function EmptyState() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)' },
      { duration: 0.4, delay: stagger(0.05) }
    );
  }, [animate]);

  const words1 = 'You have no woops.'.split(' ');
  const words2 = 'Access snippets of text from your devices on this network. Try it out!'.split(' ');

  return (
    <div ref={scope} className="text-sm text-muted-foreground space-y-1">
      <p>
        {words1.map((word, idx) => (
          <motion.span
            key={`w1-${idx}`}
            className="opacity-0 inline-block mr-1"
            style={{ filter: 'blur(4px)' }}
          >
            {word}
          </motion.span>
        ))}
      </p>
      <p>
        {words2.map((word, idx) => (
          <motion.span
            key={`w2-${idx}`}
            className="opacity-0 inline-block mr-1"
            style={{ filter: 'blur(4px)' }}
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
}
