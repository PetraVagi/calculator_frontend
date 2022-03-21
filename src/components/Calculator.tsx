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
	height: 35%;
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

export default function Calculator() {
	const numbers = Array.from(Array(10).keys()).reverse();

	return (
		<MainContainer>
			<ResultDisplay />
			<InputArea>
				<Numbers>
					{numbers.map((num: number, i: number) => (
						<Input key={`number_${i}`}>{num}</Input>
					))}
					<Input>,</Input>
					<Input>=</Input>
				</Numbers>
				<Operations>
					<Input>+</Input>
					<Input>-</Input>
					<Input>x</Input>
					<Input>/</Input>
				</Operations>
			</InputArea>
		</MainContainer>
	);
}
