[![stability-beta](https://img.shields.io/badge/stability-beta-33bbff.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#beta) [![Crowdin](https://badges.crowdin.net/intro-theme/localized.svg)](https://crowdin.com/project/intro-theme)

# Intro Theme

Intro is an HTML-first ecommerce store theme for 29 Next that focuses on performance, flexibility, and best practices for templating 29 Next themes. 

### Getting Started

* You can download/clone this repository and upload it as a ZIP file from your computer in the Storefront admin.
* You can download/clone this repository and use **Themekit** (our cross-platform command line tool) to upload it to your storefront.
* You can add a theme from your Storefront admin.

### Add the Intro Theme via Upload

1. Clone or download this respository
```
git clone git@github.com:29next/intro.git
```

2. Inside the downloaded theme files you can open the `mainifest.json` file and edit the storename to be what you would like.
```
{
    "name": "Intro",
    "version": "1.0"
}
```

3. Compress all downloaded theme files into a single ZIP file.

4. From your 29 Next admin, go to **Storefront > Themes**.

5. In the **Installed themes** section, click **Upload Theme**.

6. From the **Upload theme** page, click **Choose File** to select the ZIP file that you want to upload.

7. Click **Upload**. The theme will be added to the **Installed themes** section of your storefront.


### Add the Intro Theme using Themekit

1. Clone or download this respository
```
git clone git@github.com:29next/intro.git
```

2. Install [Theme Kit](https://github.com/29next/theme-kit) to your local development environment. 


3. Navigate to the directory where you cloned or downloaded this repository. Create an empty theme on your store using **Themekit**

```
ntk init -n <theme name> -s <store url> -a <api key>
```

> :question:  A guide for creating the required API Key can be found on our [developer docs site](https://developers.29next.com/themes/theme-kit/#generate-an-api-key)

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


### Add the Intro Theme from your Storefront admin

1. From your 29 Next admin, go to **Storefront > Themes**.

2. From the **Available Themes** card click the **Install Theme** button of the theme you wish to install.


### Theme Reference Docs

Customising the theme is as simple as changing the HTML, CSS, and JS as needed. See our Theme reference documentation for more details.

- [Getting Started with Themes](https://developers.29next.com/themes/)
- [Template Tag Refenernce](https://developers.29next.com/themes/templates/tags/)
- [Filter Reference](https://developers.29next.com/themes/templates/filters/)
- [URLs & Template Paths](https://developers.29next.com/themes/templates/urls-and-template-paths/)


### Staying Up to Date with Changes

It's a best practice for theme developers building on top of Intro to stay up to date with the latest changes. The best way to stay up to date is by adding a remote `upsteam` pointing to the Intro repository. [More on Git Forks and Upstreams](https://www.atlassian.com/git/tutorials/git-forks-and-upstreams).


1. Navigate to your local clone/fork directory

2. List existing remotes to check for `origin` and `upsteam`
```
git remote -v
```
3. If you don't have an `upstream`, add it with the `remote` command. 
```
git remote add upstream git@github.com:29next/intro.git
```
4. Verify that you now have the `upstream` remote added correctly. 
```
git remote -v
```
5. Pull in the latest changes from Intro into your local respository. 
```
git fetch upstream && git pull upstream main
```