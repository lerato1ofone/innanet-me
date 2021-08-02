import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Router from "next/router";
import '../styles/globals.scss'
import Layout from '../components/Layout'
import CustomCursor from './../components/CustomCursor';

function MyApp(props) {
  const { Component, pageProps, router } = props;

  let copies = [];

  useEffect(() => {
    Router.events.on("beforeHistoryChange", onLoad);
    return () => {
      Router.events.off("beforeHistoryChange", onLoad);
    };
  }, []);

  const onLoad = () => {
    // Create a clone of every <style> and <link> that currently affects the page. It doesn't matter
    // if Next.js is going to remove them or not since we are going to remove the copies ourselves
    // later on when the transition finishes.
    const nodes = document.querySelectorAll(
      "link[rel=stylesheet], style:not([media=x])"
    );
    copies = [...nodes].map((el) => el.cloneNode(true));

    for (let copy of copies) {
      // Remove Next.js' data attributes so the copies are not removed from the DOM in the route
      // change process.
      copy.removeAttribute("data-n-p");
      copy.removeAttribute("data-n-href");

      // Add duplicated nodes to the DOM.
      document.head.appendChild(copy);
    }
  };

  const onExit = () => {
    for (let copy of copies) {
      // Remove previous page's styles after the transition has finalized.
      document.head.removeChild(copy);
    }
  };

  return (
    <Layout>
      <AnimatePresence exitBeforeEnter={true} onExitComplete={onExit}>
        <CustomCursor {...router}/>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </Layout>
  );
}

export default MyApp;