import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { deviceSizes } from "../utils";

const MainContainer = styled.div`
	background-color: black;
	color: white;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	@media screen and (min-width: ${deviceSizes.mobileL}) {
		max-width: 100%;
		max-height: 100%;
	}
`;

const ResultDisplay = styled.div`
	height: 30%;
	max-width: calc(100% - 40px);
	display: flex;
	align-items: flex-end;
	min-width: 0;
	min-height: 0;
	overflow: scroll;
	padding: 20px;
	font-size: 1.4rem;
	font-weight: 550;
	margin-left: auto;
`;

const InputArea = styled.div`
	display: flex;
	flex: 1;
`;

const Numbers = styled.div`
	display: grid;
	flex: 3;
	grid-template-columns: auto auto auto;
	grid-template-rows: auto auto auto;
`;

const Operations = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: grey;
`;

const Input = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	font-weight: bold;
	cursor: pointer;
`;

const numbers = Array.from(Array(10).keys()).reverse();
const operations = ["+", "-", "x", "/"];

function isNumber(char: string) {
	return numbers.includes(Number(char));
}

function isOperation(char: string) {
	return operations.includes(char);
}

export default function Calculator() {
	const [valueToDisplay, setValueToDisplay] = useState<string>("");
	const [restart, setRestart] = useState<boolean>(true);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const { key } = event;
			if (isNumber(key) || isOperation(key) || key === "Backspace") handleInput(key);
			if (key === "Enter") handleEval();
		},
		[valueToDisplay],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	async function handleInput(input: string) {
		if (["DEL", "Backspace"].includes(input)) {
			setValueToDisplay(`${valueToDisplay.substring(0, valueToDisplay.length - 1)}`);
			return;
		}

		if (restart) {
			setRestart(false);

			if (isOperation(input)) {
				if (valueToDisplay.includes(".") || valueToDisplay.includes("-")) {
					setValueToDisplay(`0${input}`);
				} else {
					setValueToDisplay(`${valueToDisplay}${input}`);
				}
			} else {
				setValueToDisplay(input);
			}
		} else {
			const lastCharInDisplayedValue = valueToDisplay.charAt(valueToDisplay.length - 1);
			if (isOperation(input)) {
				if (operations.some((o) => valueToDisplay.includes(o))) {
					const previousResult = await handleEval();
					setRestart(false);
					setValueToDisplay(`${previousResult}${input}`);
					return;
				}
				if (isOperation(lastCharInDisplayedValue)) {
					setValueToDisplay(`${valueToDisplay.substring(0, valueToDisplay.length - 1)}${input}`);
					return;
				} else if (valueToDisplay === "") {
					setValueToDisplay(`0${input}`);
					return;
				}
			} else if (isNumber(input)) {
				if (lastCharInDisplayedValue === "0") {
					const charBeforeZero = valueToDisplay.charAt(valueToDisplay.length - 2);
					if (charBeforeZero === "" || isOperation(charBeforeZero)) {
						setValueToDisplay(`${valueToDisplay.substring(0, valueToDisplay.length - 1)}${input}`);
						return;
					}
				}
			}
			setValueToDisplay(`${valueToDisplay}${input}`);
		}
	}

	function checkOperations() {
		// If the last character is the operation and there is no second number, we will stop the evaluation
		const lastCharInDisplayedValue = valueToDisplay.charAt(valueToDisplay.length - 1);
		if (isOperation(lastCharInDisplayedValue)) {
			return false;
		}

		// Evaluation only runs if there are operations to calculate with in the valueToDisplay expression
		const firstCharInDisplayedValue = valueToDisplay.charAt(0);
		if (firstCharInDisplayedValue === "-") {
			return operations.some((o) => valueToDisplay.substring(1, valueToDisplay.length).includes(o));
		}
		return operations.some((o) => valueToDisplay.includes(o));
	}

	async function handleEval() {
		// We can prevent unnecessary backend calls with the checkOpreations function
		if (checkOperations()) {
			setRestart(true);

			const response = await fetch("/eval", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ expression: valueToDisplay }),
			});
			const { result, error } = await response.json();
			if (error) {
				console.log(error);
				alert(error);
			} else {
				setValueToDisplay(result.toString());
				return result.toString();
			}
		}
	}

	return (
		<MainContainer>
			<ResultDisplay>{valueToDisplay}</ResultDisplay>
			<InputArea>
				<Numbers>
					{numbers.map((num: number, i: number) => (
						<Input key={`number_${i}`} onClick={() => handleInput(num.toString())}>
							{num}
						</Input>
					))}
					<Input style={{ fontSize: "1.5rem" }} onClick={() => handleInput("DEL")}>
						DEL
					</Input>
					<Input onClick={handleEval}>=</Input>
				</Numbers>
				<Operations>
					{operations.map((op: string, i: number) => (
						<Input key={`op_${i}`} onClick={() => handleInput(op)}>
							{op}
						</Input>
					))}
				</Operations>
			</InputArea>
		</MainContainer>
	);
}
