# BMES Webmaster's Guide

### Welcome! ###

This website was developed mostly using:

- [Gulp](http://gulpjs.com/ "Gulp Homepage") - workflow management
- [Bootstrap 3](http://getbootstrap.com/ "Bootstrap Homepage") - styling and easy mobile-first design
- [JQuery](https://jquery.com/ "JQuery Homepage") - javascript library
- [Less](http://lesscss.org/ "Less Homepage") - CSS pre-processor that streamlines writing css

Each respective site has great documentation and I would suggest using these resources (in combination with Google) for development.

---

### A few quirks ###

Though this may of been a more complicated method of building the org website, I was compelled to do so with future support and upgradability in mind. Gulp provides a way to easily switch out parts and common elements across the whole site through its workflow management. It also provides lightweight debugging, enough for a project of relatively small scale without relying a full blown IDE.

I would suggest developing with [Sublime Text 3](http://www.sublimetext.com/3) and a terminal as this is what I did the bulk of development on. Some other options include the equally if not more extensible open-source editor [Atom](https://atom.io/ "Atom") made by Github, or Adobe's [Brackets](http://brackets.io/ "Brackets") created with web design as its primary focus. I have not used either of these options, so unfortunately I have no opinion to offer. Each has a sizeable community, so you will find support online no matter which editor you choose to develop with.

---

### Get Started ###


Everything is pre-installed/downloaded already and maintenance is easy! The only thing you will need to install is [Node.js](https://nodejs.org/en/ "Node.js Homepage") to use Gulp and its plugins. You should be pretty comfortable with basic command line as well as the basics of [Github](https://github.com/ "Github Homepage") for version control, though here's a [tutorial](https://help.github.com/articles/set-up-git/ "Set Up Git - User Documentation") just in case.


Clone this repo:

`git clone https://git@github.com:ckmah/bmes_website_v3.git`

Install development dependencies as well as gulp (may take a while depending on your connection):

```
sudo npm install --save-dev
sudo npm install -g gulp
```

- **sudo** - grants administrator privilege to commands, in this case to **npm**
- **npm** - node package manager, installs nodejs packages in particular gulp and various extensions/plugins
- **install** - npm command to install packages
- **-save-dev** - flag for npm to adds dependencies (can be found under devDependencies in package.json file)
- **-g** - optional flag for install, installs globally

To start developing, simply type `gulp` in your working directory (`.../bmes_website_v3`):

![Gulp demo](https://github.com/ckmah/bmes_website_v3/raw/master/readme_assets/gulp.png)

---

### File Organization ###

```
├── dev
│   ├── committees
│   ├── contact
│   ├── css
│   ├── events
│   ├── fonts
│   ├── images
│   ├── js
│   └── styles
├── dist
│   ├── committees
│   ├── contact
│   ├── css
│   ├── events
│   ├── images
│   └── js
├── node_modules
...
```

Gulp is a tool for creating a workflow. In this case, I have used it to organize, clean up and automate the tediousness of deploying the site. The configuration can be found in `gulpfile.js`. How this workflow works:

**dev** - This is where you will be working. An important concept to note is that anytime you link an asset, its path should be relative to the dist folder. Take a look at the head of `index.html` for an example.

**dist** - Do NOT modify files in this directory. The gulp pipeline moves the necessary files from `dev` and reorders them in dist. Copy the *contents* of this folder to the server.

You should be able to intuitively grasp the inner structure of these folders if you read through some code and browse the live site.

Feel free to contact me if you have any issues/questions regarding this project. I highly suggest getting used to browsing documentation to understand how to maintain this site. Good luck!