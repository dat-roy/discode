import { Fragment } from "react";
import LeftBar from "../components/LeftBar";
import Main from '../components/Main';
import RightBar from "../components/RightBar";

export default function LayoutWrapper({ leftElement, mainElement, rightElement }) {
    return (
        <Fragment>
            {
                !leftElement ||
                <LeftBar>
                    {leftElement}
                </LeftBar>
            }

            <Main>
                {mainElement}
            </Main>

            {
                !rightElement ||
                <RightBar>
                    {rightElement}
                </RightBar>
            }
        </Fragment>
    )
}