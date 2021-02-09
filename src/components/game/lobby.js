/* leny/enigjewo
 *
 * /src/components/game/lobby.js - Game Component: Lobby
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import "styles/lobby.scss";

import {useContext, useEffect, useRef} from "react";

import {GameStoreContext} from "store/game";

import {NBSP} from "core/constants";
import {maps, loadGeoJSON} from "core/maps";
import bbox from "@turf/bbox";
import classnames from "classnames";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import Copiable from "components/commons/copiable";

const Lobby = () => {
    const gmap = useRef(null);
    const {
        code,
        title,
        settings: {map, rounds, duration},
        players,
        player: key,
    } = useContext(GameStoreContext);
    const player = players[key];
    const gameURL = `${location.protocol}//${location.host}${location.pathname}?c=${code}`;

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        gmap.current.setZoom(1);
        gmap.current.setCenter({lat: 0, lng: 0});
        gmap.current.data.forEach(f => gmap.current.data.remove(f));

        if (map !== "world") {
            (async () => {
                const geoJSON = await loadGeoJSON(map);
                const [west, south, east, north] = bbox(geoJSON);
                gmap.current.data.addGeoJson(geoJSON);
                gmap.current.data.setStyle({
                    fillColor: "hsl(204, 86%, 53%)",
                    strokeColor: "hsl(217, 71%, 53%)",
                    strokeWeight: 2,
                });
                gmap.current.fitBounds({north, east, south, west});
            })();
        }
    }, [gmap.current, map]);

    let $footer = (
        <span
            className={classnames(
                "button",
                "is-static",
                "card-footer-item",
                "no-top-radius",
            )}>
            {"Waiting for game start…"}
        </span>
    );

    if (player.isOwner) {
        const playersCount = Object.keys(players).length;

        $footer = (
            <Button
                type={"submit"}
                disabled={playersCount < 2}
                label={playersCount < 2 ? "Waiting for players…" : "Start Game"}
                variant={"link"}
                className={classnames("card-footer-item", "no-top-radius")}
            />
        );
    }

    return (
        <div className={classnames("columns", "is-centered")}>
            <div
                className={classnames(
                    "column",
                    "is-three-quarters",
                    "section",
                )}>
                <div className={"card"}>
                    <header
                        className={classnames(
                            "card-header",
                            "has-background-info",
                        )}>
                        <span
                            className={classnames(
                                "card-header-title",
                                "has-text-white",
                            )}>
                            {title}
                        </span>
                    </header>
                    <div
                        className={classnames(
                            "card-content",
                            "has-text-centered",
                        )}>
                        <div className={classnames("mb-2")}>
                            <strong
                                className={classnames("is-block", "is-size-2")}>
                                <Copiable text={code}>{code}</Copiable>
                            </strong>
                            <span className={"is-size-5"}>
                                <Copiable text={gameURL}>{gameURL}</Copiable>
                            </span>
                        </div>
                        <div
                            className={classnames(
                                "notification",
                                "is-info",
                                "is-light",
                            )}>
                            {
                                "Send the code or the URL to the players & wait for them to join the game."
                            }
                        </div>
                    </div>
                    <div
                        className={classnames(
                            "card-image",
                            "columns",
                            "mx-0",
                            "mb-0",
                            "mt-0",
                        )}>
                        <div
                            className={classnames(
                                "column",
                                "is-half",
                                "p-0",
                                "has-background-info-light",
                            )}>
                            <GMap className={"lobby__map"} ref={gmap} />
                        </div>
                        <div
                            className={classnames("column", "is-half", "pt-0")}>
                            <ul>
                                <li>
                                    <strong>{"Rounds:"}</strong>
                                    {NBSP}
                                    {rounds}
                                </li>
                                <li>
                                    <strong>{"Duration:"}</strong>
                                    {NBSP}
                                    {duration
                                        ? `${String(
                                              Math.floor(duration / 60),
                                          ).padStart(2, "0")}:${String(
                                              duration % 60,
                                          ).padStart(2, "0")}`
                                        : "Infinite"}
                                </li>
                                <li>
                                    <strong>{"Map:"}</strong>
                                    {NBSP}
                                    {maps[map].label}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <footer className={"card-footer"}>{$footer}</footer>
                </div>
            </div>
        </div>
    );
};

Lobby.propTypes = {};

export default Lobby;
