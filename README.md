[![stability-beta](https://img.shields.io/badge/stability-beta-33bbff.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#beta)

# Intro Theme

Intro is an HTML-first ecommerce store theme for 29 Next that focuses on perofrmance, flexibility, and best practices for templating 29 Next themes. 

### Getting Started

1. Clone the respository
```
git clone git@github.com:29next/intro.git
```

2. Install [Theme Kit](https://github.com/29next/theme-kit) to your local development environment. 

3. Create an empty theme on your store

```
ntk init -n <theme name> -s <store url> -a <api key>
```

4. Push Theme to Store

```
ntk push
```
> :question: After you have initialized the theme, `ntk` will automatically create a config.yml file so you dont need to pass your store url, api key, and theme id parameters. This file contains your api key so keep it safe and secure. 

5. Customise & Preview Theme Changes

```
ntk watch
```
> :question:  Use the `ntk watch` command to monitor and sync changes from your local environment to the store. 


### Theme Reference Docs

Customising the theme is as simple as changing the HTML, CSS, and JS as needed. See our Theme reference documentation for more details.

- [Getting Started with Themes](https://developers.29next.com/themes/)
- [Template Tag Refenernce](https://developers.29next.com/themes/templates/tags/)
- [Filter Reference](https://developers.29next.com/themes/templates/filters/)
- [URLs & Template Paths](https://developers.29next.com/themes/templates/urls-and-template-paths/)
