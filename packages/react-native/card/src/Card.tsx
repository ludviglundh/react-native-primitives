import * as React from 'react';
import {Text, TextProps, View, ViewProps} from 'react-native';

const Card = React.forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));

Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<View, TextProps>((props, ref) => (
  <Text ref={ref} {...props} />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<View, TextProps>((props, ref) => (
  <Text ref={ref} {...props} />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));

CardFooter.displayName = 'CardFooter';

const Root = Card;
const Header = CardHeader;
const Title = CardTitle;
const Description = CardDescription;
const Content = CardContent;
const Footer = CardFooter;

export {
  Root,
  Header,
  Title,
  Description,
  Content,
  Footer,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
