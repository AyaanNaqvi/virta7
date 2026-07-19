import { motion, AnimatePresence } from 'framer-motion';
import { Check, ListChecks } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { StarBadge } from '../components/ui/StarBadge';
import { useChildData } from '../contexts/ChildDataContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';

export function Tasks() {
  const { tasks, completeTask } = useChildData();
  const reduceMotion = useReduceMotion();

  const available = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">Tasks</h1>
        <Card className="flex flex-col items-center py-8 text-center">
          <ListChecks className="mb-3 h-10 w-10 text-text-muted" aria-hidden="true" />
          <p className="font-semibold text-text">No tasks yet</p>
          <p className="text-text-muted">Ask your caregiver to add some.</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">Tasks</h1>
      <p className="mb-6 text-text-muted">Complete tasks to earn stars.</p>

      <div className="mb-6 flex flex-col gap-3">
        {available.length === 0 && (
          <Card className="text-center text-text-muted">All tasks are done. Great job!</Card>
        )}
        {available.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => completeTask(task.id)}
            className="w-full text-left"
          >
            <Card className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <ListChecks className="h-6 w-6 text-primary" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">{task.title}</p>
                {task.description && <p className="mb-1 text-sm text-text-muted">{task.description}</p>}
                <StarBadge count={task.starReward} />
              </div>
            </Card>
          </button>
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-bold text-text">Completed</h2>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {completed.map((task) => (
                <motion.div
                  key={task.id}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                >
                  <Card className="flex items-center gap-4 opacity-60">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-alt">
                      <Check className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-text">{task.title}</p>
                      <p className="text-sm text-text-muted">Completed</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </PageContainer>
  );
}
