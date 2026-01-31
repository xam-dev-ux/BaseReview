import { Helmet } from 'react-helmet-async';

interface EmbedMetadataProps {
  title?: string;
  imageUrl?: string;
  buttonTitle?: string;
  actionUrl?: string;
  actionName?: string;
}

export function EmbedMetadata({
  imageUrl = '/hero.png',
  buttonTitle = 'Open BaseReview',
  actionUrl = '/',
  actionName = 'Launch BaseReview',
}: EmbedMetadataProps) {
  const embedData = {
    version: 'next',
    imageUrl: new URL(imageUrl, window.location.origin).href,
    button: {
      title: buttonTitle,
      action: {
        type: 'launch_frame',
        url: new URL(actionUrl, window.location.origin).href,
        name: actionName,
        splashImageUrl: new URL('/splash.png', window.location.origin).href,
        splashBackgroundColor: '#0052FF',
      },
    },
  };

  return (
    <Helmet>
      <meta name="fc:miniapp" content={JSON.stringify(embedData)} />
    </Helmet>
  );
}
