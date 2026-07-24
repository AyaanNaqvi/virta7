import { useState } from 'react';
import { Gift, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StarBadge } from '../components/ui/StarBadge';
import { DecorativeStars } from '../components/ui/DecorativeStars';
import { useChildData } from '../contexts/ChildDataContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';

export function Stars() {
  const { stars, rewards, redeemReward } = useChildData();
  const reduceMotion = useReduceMotion();
  const { t } = useLanguage();
  const [justRedeemedId, setJustRedeemedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const available = rewards.filter((r) => !r.redeemed).sort((a, b) => a.starCost - b.starCost);
  const redeemed = rewards.filter((r) => r.redeemed);

  const nextReward = available.find((r) => r.starCost > stars.total) ?? available[0];

  async function handleRedeem(id: string) {
    setError('');
    const result = await redeemReward(id);
    if (result.ok) {
      setJustRedeemedId(id);
      setTimeout(() => setJustRedeemedId(null), 1600);
    } else if (result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="relative">
      <DecorativeStars />
      <PageContainer className="relative">
      <h1 className="mb-5 text-2xl font-bold text-text">{t('stars_title')}</h1>

      {error && (
        <p role="alert" className="mb-4 text-alert">
          {error}
        </p>
      )}

      <Card className="mb-6 flex flex-col items-center py-8 text-center">
        <span className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-accent-bg">
          <Star className="h-10 w-10 fill-accent text-accent" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-text-muted">{t('stars_yourStars')}</p>
        <p className="text-4xl font-bold text-text">{stars.total}</p>
      </Card>

      {nextReward && (
        <Card className="mb-6">
          <p className="mb-3 font-semibold text-text">
            {stars.total >= nextReward.starCost
              ? t('stars_canRedeem', { title: nextReward.title })
              : t('stars_nextReward', { title: nextReward.title })}
          </p>
          <ProgressBar value={stars.total} max={nextReward.starCost} />
        </Card>
      )}

      <h2 className="mb-3 text-lg font-bold text-text">{t('stars_rewardsTitle')}</h2>
      <div className="mb-6 flex flex-col gap-3">
        {available.length === 0 && redeemed.length === 0 && (
          <Card className="text-center text-text-muted">{t('stars_noRewards')}</Card>
        )}
        {available.map((reward) => {
          const affordable = stars.total >= reward.starCost;
          const justRedeemed = justRedeemedId === reward.id;
          return (
            <Card key={reward.id} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Gift className="h-6 w-6 text-primary" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">{reward.title}</p>
                <StarBadge count={reward.starCost} />
              </div>
              <Button
                size="md"
                variant={affordable ? 'secondary' : 'ghost'}
                disabled={!affordable}
                onClick={() => handleRedeem(reward.id)}
              >
                {justRedeemed ? (
                  <motion.span
                    className="flex items-center gap-1"
                    initial={reduceMotion ? { scale: 1 } : { scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {t('stars_yay')}
                  </motion.span>
                ) : (
                  t('stars_redeem')
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {redeemed.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-bold text-text">{t('stars_alreadyRedeemed')}</h2>
          <div className="flex flex-col gap-3">
            {redeemed.map((reward) => (
              <Card key={reward.id} className="flex items-center gap-4 opacity-60">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-alt">
                  <Check className="h-6 w-6 text-secondary" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-text">{reward.title}</p>
                  <p className="text-sm text-text-muted">{t('stars_redeemed')}</p>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      </PageContainer>
    </div>
  );
}
