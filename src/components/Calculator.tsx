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
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	padding: 20px;
	font-size: 1.6rem;
	font-weight: 550;
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
`;

const numbers = Array.from(Array(10).keys()).reverse();
const operations = ["+", "-", "x", "/"];

export default function Calculator() {
	const [valueToDisplay, setValueToDisplay] = useState<string>("");
	const [restart, setRestart] = useState<boolean>(true);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const { key } = event;
			if ((Number(key) >= 0 && Number(key) <= 9) || operations.includes(key) || key === ".") handleInput(key);
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

	function handleInput(input: string) {
		if (restart) {
			setRestart(false);

			if (operations.includes(input)) {
				setValueToDisplay(`${valueToDisplay}${input}`);
			} else if (input === ".") {
				setValueToDisplay("0.");
			} else {
				setValueToDisplay(input);
			}
		} else {
			const lastCharInDisplayedValue = valueToDisplay.charAt(valueToDisplay.length - 1);
			if (operations.includes(input)) {
				if (operations.includes(lastCharInDisplayedValue) || lastCharInDisplayedValue === ".") {
					setValueToDisplay(`${valueToDisplay.substring(0, valueToDisplay.length - 1)}${input}`);
					return;
				}
			} else if (input === ".") {
				if (operations.includes(lastCharInDisplayedValue)) {
					setValueToDisplay(`${valueToDisplay}0.`);
					return;
				}
			} else if (Number(input) >= 0 && Number(input) <= 9) {
				if (lastCharInDisplayedValue === "0") {
					const charBeforeZero = valueToDisplay.charAt(valueToDisplay.length - 2);
					if (charBeforeZero === "" || operations.includes(charBeforeZero)) {
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
		if (operations.includes(lastCharInDisplayedValue) || lastCharInDisplayedValue === ".") {
			return false;
		}

		// Evaluation only runs if there are operations to calculate with in the valueToDisplay expression
		const firstCharInDisplayedValue = valueToDisplay.charAt(0);
		if (firstCharInDisplayedValue === "-") {
			return operations.some((v) => valueToDisplay.substring(1, valueToDisplay.length).includes(v));
		}
		return operations.some((v) => valueToDisplay.includes(v));
	}

	function handleEval() {
		if (checkOperations()) {
			setRestart(true);
			// TODO call backend function
			setValueToDisplay(eval(valueToDisplay).toString());
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
					<Input onClick={() => handleInput(".")}>.</Input>
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
