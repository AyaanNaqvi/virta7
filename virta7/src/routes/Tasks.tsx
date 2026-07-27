import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ListChecks } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { StarBadge } from '../components/ui/StarBadge';
import { useChildData } from '../contexts/ChildDataContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';

export function Tasks() {
  const { tasks, completeTask } = useChildData();
  const reduceMotion = useReduceMotion();
  const { t } = useLanguage();

  const available = tasks.filter((task) => !task.completed && !task.pendingApproval);
  const pending = tasks.filter((task) => task.pendingApproval);
  const completed = tasks.filter((task) => task.completed);

  if (tasks.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">{t('tasks_title')}</h1>
        <Card className="flex flex-col items-center py-8 text-center">
          <ListChecks className="mb-3 h-10 w-10 text-text-muted" aria-hidden="true" />
          <p className="font-semibold text-text">{t('tasks_noTasksYet')}</p>
          <p className="text-text-muted">{t('tasks_askCaregiver')}</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('tasks_title')}</h1>
      <p className="mb-6 text-text-muted">{t('tasks_subtitle')}</p>

      <div className="mb-6 flex flex-col gap-3">
        {available.length === 0 && pending.length === 0 && (
          <Card className="text-center text-text-muted">{t('tasks_allDone')}</Card>
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

      {pending.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-bold text-text">{t('tasks_waitingApprovalHeading')}</h2>
          <div className="mb-6 flex flex-col gap-3">
            <AnimatePresence>
              {pending.map((task) => (
                <motion.div
                  key={task.id}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                >
                  <Card className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                      <Clock className="h-6 w-6 text-accent" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-text">{task.title}</p>
                      <p className="text-sm text-text-muted">{t('tasks_waitingApproval')}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-bold text-text">{t('tasks_completed')}</h2>
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
                      <p className="text-sm text-text-muted">{t('tasks_completed')}</p>
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
