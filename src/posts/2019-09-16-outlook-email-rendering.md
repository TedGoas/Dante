---
title: "Outlook Rendering Issues: 5 Tips to Ensure Your Emails Display Properly"
body_class: blog
featured_image: outlook/header.jpg
image_caption: Someone frustrated in front of a laptop.
description:  Earlier this year, I wrote an internal guide for my co-workers explaining some of the common gotchas that make coding HTML emails for Outlook so tedious. This is a lightly edited version that that article.
---

_Earlier this year, I wrote an internal guide for my co-workers explaining some of the common gotchas that make coding HTML emails for Outlook so tedious. This is a lightly edited version that that article._

There are more than 400 million users worldwide using what might be the best corporate email client. Coding HTML emails is complicated, especially when it comes to making them look good in Outlook. When it comes down to creating beautiful, responsive emails, Outlook will usually take those templates we worked so hard on and render them with broken links, missing pictures, and a misaligned layout.

To start, consider the sheer number of Outlook products: Outlook 2000, 2002, 2003, 2007, 2010, 2013, 2016, 2019, Outlook.com, Outlook for Office 365, Outlook for Mac, Outlook for iOS, Outlook for Android… and there’ll be more in years to come. And they all use different rendering engines. Some use Webkit. Some use Internet Explorer. Some use Microsoft Word. On top of that, they each add their own flavor of rendering, classes, and security policies. Some display images by default, but some block them. Some support media queries for responsive design, but most don’t.

So how do you ensure your email renders properly in Outlook despite all its quirks? Here are some tips…

## 1. Include CSS Resets for Outlook

Just like when developing for the web, it’s a good idea to provide a reset CSS for emails to help to normalize how code gets rendered and prevent any unwanted styling in email clients. There are a few kinds of CSS resets:

### The `<head>` reset

Adding a few CSS properties in the email `<head>`’s `<style>` tag will reset most of Outlook’s unwanted default styles.

<script src="https://gist.github.com/TedGoas/c5b0a1f391c62bd3c8e5c57e29341cc2.js"></script>

A CSS reset in the email’s `<head>` is a good start, but adding a few more reset styles inline in the email body’s markup will ensure consistent rendering in Outlook.

### The `<body>` reset

Adding a few reset styles in the `<body>` tag will ensure consistent spacing and text `line-height` in Outlook.

<script src="https://gist.github.com/TedGoas/f56ce31b744c1238e07aab6e9d8151a4.js"></script>

This negates the unintended default spacing around an email’s main content and gives us better control over `line-height` in Outlook.

### The `<table>` reset

Tables are still the bread and butter for layout in email design, so we’ll want to negate some default styling that comes with tables. Adding inline attributes to all table tags will remove Outlook’s default spacing and borders on each individual table:

<script src="https://gist.github.com/TedGoas/ea33edc1def277d088842c801962f243.js"></script>

Including these resets will ensure Outlook does not add any unwanted styles to your email designs.

## 2. Stick to tables

Using tables for layout isn’t a good practice in the web world, but it’s still good practice in the email world… especially for supporting Outlook. Most Outlook versions on Windows don’t have good support for the CSS box model or things like flexbox, CSS Grid, and floats. This makes it hard to use semantic HTML to build email layouts that display properly in Outlook.

Take this bit of markup:

<script src="https://gist.github.com/TedGoas/6d3427d99bed7966561ed4818706acd4.js"></script>

While most web browsers could display this HTML in two columns, Outlook would display each column div as its own row. 😕

The most reliable way to display these two columns side by side in Outlook is to use tables:

<script src="https://gist.github.com/TedGoas/56b5dc1446a93da51ea664e6b8f6d62b.js"></script>

Embracing tables for layout might seem antiquated, it’s still the best way to ensure email layouts render properly in Outlook.

## 3. Bulletproof buttons

Bulletproof buttons allow us to build buttons with code instead of images, making them accessible and easy to maintain. Calls-to-action are critical in getting people to interact with your emails.

Unfortunately Outlook doesn’t recognize link tags as block elements, nor does it allow us to change the display of inline tags using the display property. This means we can’t effectively style an `<a href=””>` tag by itself. Instead we have to wrap the link in a `<table>` and duplicate a few CSS properties to ensure the button looks like a button in Outlook.

<figure>
<div class="px-3 bg-gray-8 inline-block rounded">
    <img src="/assets/img/outlook/bulletproof-buttons.svg" alt="" width="736" height="100">
  </div>
  <figcaption>Regular button display vs bulletproof button display.</figcaption>
</figure>

<script src="https://gist.github.com/TedGoas/cc2f851f75e564c2ee343e34a79a1b88.js"></script>

This is one of a few ways to achieve bulletproof buttons in Outlook. Both Litmus and Campaign Monitor have done deep dives on bulletproof email buttons, including versions that use Vector Markup Language (VML) to draw gradients in Windows Outlook.

## 4. Include system fonts

All computers and mobile devices come pre-installed with a limited number of system fonts. Arial, Times New Roman, Verdana, Georgia being some of the most common ones. But Web fonts allow designers to get creative with their typography, allowing them to choose from a large number of web fonts for their designs.

However [not every version of Outlook supports web fonts](https://www.campaignmonitor.com/css/text-fonts/font-face/), so it’s important to have a fallback system font defined for those version where web fonts don’t display.

Since some versions of Outlook don’t support web fonts, we should include system fonts behind the web font in the font stack.

<script src="https://gist.github.com/TedGoas/468c87aed1ef1c8060211e10a2edf7ea.js"></script>

Rémi Parmentier wrote about a few ways [web fonts can be controlled in Outlook](https://emails.hteumeuleu.com/today-i-learned-about-mso-generic-font-family-85b0e4703079). But long story short: web fonts will never display in Windows Outlook, so including system fonts in an email’s font stack as a fallback will ensure everyone sees consistent (though not identical) typography.

## 5. Bulletproof foreground images

Many versions of Outlook block images by default, only downloading them if a user requests they be downloaded. We can’t force images to automatically download and display, but we can optimize the email experience when they don’t.

<script src="https://gist.github.com/TedGoas/242f97cd538e282c6d2ab16c9ff0c6c8.js"></script>

There’s a lot going on there, let’s break it down:
* Using absolute paths (instead of relative paths) ensures our images can be downloaded regardless of where the email is opened. We have to host an image somewhere public so any email client can access them.
* Using either `.png`, `.jpg`, or `.gif` file formats ensures our image can be displayed in every major email client, including all versions of Outlook. While formats like WebP and SVG have good support in web browsers, they are not well supported in email clients.
* Specifying image widths using the `width`, `max-width`, and `height` ensures our images display at the proper size on desktop and scale down on mobile. In the example above, the image displays at a maximum of 600px (like on Windows Outlook), but scales down proportionally on mobile (like iOS Outlook).
* Using `border=”0”` removes unwanted borders on emails.
* Using `display: block;` removes unwanted gaps beneath images.
* Specifying alt text to provides contextual information about our images, especially handy when Outlook blocks images from automatically displaying. We can also style blocked images with CSS properties like `background-color`, `font-family`, `font-size`, and `color`.

<figure>
<div class="px-3 bg-gray-8 inline-block rounded-sm">
    <img src="/assets/img/outlook/bulletproof-images.svg" alt="" width="736" height="500">
  </div>
    <figcaption>Regular image display vs bulletproof image display.</figcaption>
</figure>

## Conclusion

Emails in Outlook can be tricky, so even after following the tips mentioned above, emails should always be tested to ensure nothing breaks. Other helpful resources:

* [Fixing bugs with Outlook specific CSS](https://cm.engineering/fixing-bugs-with-outlook-specific-css-f4b8ae5be4f4)
* [Word 2007 HTML and CSS Rendering](http://msdn.microsoft.com/en-us/library/aa338201%28office.12%29.aspx)
* [Responsive HTML Email Templates for Outlook](https://htmlemail.io/)
* [Can I Use in HTML Emails](https://caniuse.email/)

<hr role="presentation" aria-role="hidden" class="hr-sm">

Also published at <a href="https://medium.com/email-design/outlook-rendering-issues-5-tips-to-ensure-your-emails-display-properly-9520b2456166">https://medium.com/email-design/outlook-rendering-issues-5-tips-to-ensure-your-emails-display-properly-9520b2456166</a>
